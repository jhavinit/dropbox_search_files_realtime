/**
 * @fileoverview Dropbox service for managing file operations with Dropbox API
 * Handles authentication, file listing, and downloading operations.
 *
 * Features:
 * - Automatic token refresh
 * - File listing with metadata
 * - File downloading with retry logic
 * - Error handling and logging
 * - Dropbox shared link creation
 *
 * Required Environment Variables:
 * - DROPBOX_ACCESS_TOKEN: Initial access token
 * - DROPBOX_REFRESH_TOKEN: Refresh token for authentication
 * - DROPBOX_APP_KEY: Dropbox application key
 * - DROPBOX_APP_SECRET: Dropbox application secret
 */

import { Dropbox } from "dropbox";
import {
  handleErrors,
  NetworkError,
  DropboxError,
} from "../utils/error.decorator";
import { logInfo, logError, logDebug } from "../utils/logger";
import * as fs from "fs";
import * as path from "path";
import {
  IDropboxFile,
  ITokenInfo,
  IDropboxResponse,
} from "../interfaces/dropbox.interface";
import {
  DOWNLOADS_DIRECTORY,
  DROPBOX_ACCESS_TOKEN,
  DROPBOX_REFRESH_TOKEN,
  DROPBOX_APP_KEY,
  DROPBOX_APP_SECRET,
} from "../constants/app.constants";

/**
 * Service class for handling Dropbox operations
 * Manages authentication and file operations
 */
export class DropboxService {
  private dropbox!: Dropbox;
  private tokenInfo: ITokenInfo;
  private readonly TOKEN_EXPIRY_BUFFER = 300; // Refresh token 5 minutes before expiry

  /**
   * Initializes the Dropbox service with authentication tokens
   * Sets up initial token state and Dropbox client
   *
   * @throws {Error} If initialization fails
   */
  constructor() {
    logInfo("Initializing DropboxService");
    this.tokenInfo = {
      accessToken: DROPBOX_ACCESS_TOKEN,
      refreshToken: DROPBOX_REFRESH_TOKEN,
      expiresAt: Date.now() + 14400000, // Default 4 hour expiry
    };
    this.initializeDropboxClient();
  }

  /**
   * Initialize the Dropbox client with current access token
   *
   * @private
   * @throws {Error} If client initialization fails
   */
  private initializeDropboxClient(): void {
    try {
      this.dropbox = new Dropbox({ accessToken: this.tokenInfo.accessToken });
      logDebug("Dropbox client initialized", { accessToken: "***" });
    } catch (error) {
      logError(
        "Failed to initialize Dropbox client",
        error instanceof Error ? error : undefined
      );
      throw new Error("Failed to initialize Dropbox client");
    }
  }

  /**
   * Refresh the access token if it's expired or about to expire
   *
   * @private
   * @throws {NetworkError} If token refresh request fails
   * @throws {DropboxError} If Dropbox API returns an error
   */
  @handleErrors({
    transformError: (error) => new NetworkError("Token refresh failed", error),
  })
  private async refreshTokenIfNeeded(): Promise<void> {
    const now = Date.now();
    if (now + this.TOKEN_EXPIRY_BUFFER * 1000 >= this.tokenInfo.expiresAt) {
      try {
        const response = await fetch("https://api.dropbox.com/oauth2/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: this.tokenInfo.refreshToken,
            client_id: DROPBOX_APP_KEY,
            client_secret: DROPBOX_APP_SECRET,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Token refresh failed:", {
            status: response.status,
            statusText: response.statusText,
            error: errorText,
          });
          throw new Error(
            `Failed to refresh token: ${response.statusText} - ${errorText}`
          );
        }

        const data = await response.json();

        this.tokenInfo = {
          accessToken: data.access_token,
          refreshToken: data.refresh_token || this.tokenInfo.refreshToken,
          expiresAt: Date.now() + data.expires_in * 1000,
        };

        // Re-initialize the Dropbox client with the new token
        this.dropbox = new Dropbox({ accessToken: this.tokenInfo.accessToken });
      } catch (error: any) {
        logError("Error during token refresh:", error);
        throw error;
      }
    } else {
      logDebug("Token still valid, no refresh needed");
    }
  }

  /**
   * List and download files from a Dropbox folder
   *
   * @param folderPath - Path to the folder in Dropbox (default: root folder "")
   * @returns Promise resolving to array of file information
   * @throws {DropboxError} If Dropbox API request fails
   * @throws {NetworkError} If network request fails
   */
  @handleErrors()
  async getFiles(folderPath = "", retryCount = 0): Promise<IDropboxFile[]> {
    try {
      await this.refreshTokenIfNeeded();
      const response = await this.dropbox.filesListFolder({ path: folderPath });
      logDebug("Received Dropbox file list", {
        entryCount: response.result.entries.length,
        folderPath,
      });

      const files: IDropboxFile[] = [];
      for (const entry of response.result.entries) {
        if (entry[".tag"] === "file" && entry.path_lower) {
          await this.downloadFile(entry.path_lower, DOWNLOADS_DIRECTORY);

          // Create a shareable link for the file
          const shareResponse = await this.dropbox.sharingCreateSharedLink({
            path: entry.path_lower,
          });

          // Convert the shared link to a direct download link
          const url = shareResponse.result.url.replace(
            "www.dropbox.com",
            "dl.dropboxusercontent.com"
          );

          files.push({
            name: entry.name,
            path_lower: entry.path_lower,
            url: url,
          });
        }
      }

      logInfo(`Successfully processed files from Dropbox`, {
        fileCount: files.length,
        folderPath,
      });
      return files;
    } catch (error: any) {
      if (error.status === 401 && retryCount === 0) {
        logInfo("Received 401, refreshing token and retrying");
        this.tokenInfo.expiresAt = 0;
        await this.refreshTokenIfNeeded();
        return this.getFiles(folderPath, retryCount + 1);
      }

      // // Handle case where shared link already exists
      // if (error?.error?.shared_link_already_exists) {
      //   const existingUrl = error.error.shared_link_already_exists.metadata.url;
      //   return existingUrl.replace(
      //     "www.dropbox.com",
      //     "dl.dropboxusercontent.com"
      //   );
      // }

      throw error;
    }
  }

  /**
   * Download a file from Dropbox to local storage
   *
   * @param dropboxPath - Path to the file in Dropbox
   * @param localDirectory - Local directory to save the file
   * @throws {DropboxError} If file download fails
   * @throws {Error} If file writing fails
   */
  @handleErrors()
  async downloadFile(
    dropboxPath: string,
    localDirectory: string,
    retryCount = 0
  ): Promise<void> {
    try {
      await this.refreshTokenIfNeeded();

      logDebug("Starting file download", { dropboxPath, localDirectory });

      const response = await this.dropbox.filesDownload({ path: dropboxPath });
      if (!("fileBinary" in response.result)) {
        throw new DropboxError("File content missing in response", 400);
      }

      const fileName = path.basename(dropboxPath);
      const localPath = path.join(
        path.join(__dirname, `../../${localDirectory}`),
        fileName
      );

      fs.writeFileSync(localPath, response.result.fileBinary as Buffer);
      logInfo(`File downloaded successfully`, {
        fileName,
        localPath,
        size: (response.result.fileBinary as Buffer).length,
      });
    } catch (error: any) {
      if (error.status === 401 && retryCount === 0) {
        logInfo("Received 401, refreshing token and retrying");
        this.tokenInfo.expiresAt = 0;
        await this.refreshTokenIfNeeded();
        return this.downloadFile(dropboxPath, localDirectory, retryCount + 1);
      }
      throw error;
    }
  }
}
