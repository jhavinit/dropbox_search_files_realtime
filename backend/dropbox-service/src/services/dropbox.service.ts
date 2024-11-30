import { Dropbox } from "dropbox";
import { handleErrors } from "../utils/error.decorator";
import { logger } from "../utils/logger";
import * as fs from "fs";
import * as path from "path";
import { IDropboxFile } from "../interfaces/dropbox.interface";
import { 
    DOWNLOADS_DIRECTORY, 
    DROPBOX_ACCESS_TOKEN,
    DROPBOX_REFRESH_TOKEN,
    DROPBOX_APP_KEY,
    DROPBOX_APP_SECRET 
} from "../constants/app.constants";

interface TokenInfo {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
}

export class DropboxService {
    private dropbox: Dropbox;
    private tokenInfo: TokenInfo;
    private readonly TOKEN_EXPIRY_BUFFER = 300; // Refresh token 5 minutes before expiry

    constructor() {
        this.tokenInfo = {
            accessToken: DROPBOX_ACCESS_TOKEN,
            refreshToken: DROPBOX_REFRESH_TOKEN,
            expiresAt: Date.now() + 14400000 // Default 4 hour expiry
            // expiresAt: Date.now() + 604800000
        };
        this.dropbox = new Dropbox({ accessToken: this.tokenInfo.accessToken });
    }

    private async refreshTokenIfNeeded(): Promise<void> {
        const now = Date.now();
        if (now + this.TOKEN_EXPIRY_BUFFER * 1000 >= this.tokenInfo.expiresAt) {
            try {
            console.log("Token expired")

                logger.info('Refreshing Dropbox access token...');
                const response = await fetch('https://api.dropbox.com/oauth2/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        grant_type: 'refresh_token',
                        refresh_token: this.tokenInfo.refreshToken,
                        client_id: DROPBOX_APP_KEY,
                        client_secret: DROPBOX_APP_SECRET,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Failed to refresh token: ${response.statusText}`);
                }

                const data = await response.json();
                this.tokenInfo = {
                    accessToken: data.access_token,
                    refreshToken: data.refresh_token || this.tokenInfo.refreshToken,
                    expiresAt: Date.now() + (data.expires_in * 1000)
                };

                // Update Dropbox client with new token
                this.dropbox = new Dropbox({ accessToken: this.tokenInfo.accessToken });
                logger.info('Successfully refreshed Dropbox access token');
            } catch (error) {
                logger.error('Error refreshing token:', error);
                throw new Error('Failed to refresh Dropbox access token');
            }
        } else {
            console.log("Token not expired")
        }
    }

    @handleErrors()
    async getFiles(folderPath: string = ""): Promise<IDropboxFile[]> {
        await this.refreshTokenIfNeeded();
        
        try {
            const response = await this.dropbox.filesListFolder({ path: folderPath });
            logger.debug("Response: ", response.result.entries);

            const files: IDropboxFile[] = [];
            for (const entry of response.result.entries) {
                if (entry[".tag"] === "file") {
                    await this.downloadFile(entry.path_lower as string, DOWNLOADS_DIRECTORY);
                    files.push({
                        name: entry.name,
                        path_lower: entry.path_lower as string,
                        url: entry.path_lower as string,
                    });
                }
            }

            logger.info(`Fetched ${files.length} files from Dropbox.`);
            return files;
        } catch (error :any) {
            console.log("error", error)
            if (error && error?.status === 401) {
                console.log("Auth token error")
                // Force token refresh on authentication error
                this.tokenInfo.expiresAt = 0;
                await this.refreshTokenIfNeeded();
                // Retry the operation
                return this.getFiles(folderPath);
            }
            throw error;
        }
    }

    @handleErrors()
    async downloadFile(dropboxPath: string, localDirectory: string): Promise<void> {
        await this.refreshTokenIfNeeded();
        
        try {
            const response = await this.dropbox.filesDownload({ path: dropboxPath });
            if (!("fileBinary" in response.result)) {
                throw new Error("File content missing in response.");
            }

            const fileName = path.basename(dropboxPath);
            const localPath = path.join(path.join(__dirname,`../../${localDirectory}`), fileName);

            fs.writeFileSync(localPath, response.result.fileBinary as Buffer);
            logger.info(`File downloaded successfully: ${localPath}`);
        } catch (error :any) {
            if (error?.status === 401) {
                console.log("Auth token error")
                // Force token refresh on authentication error
                this.tokenInfo.expiresAt = 0;
                await this.refreshTokenIfNeeded();
                // Retry the operation
                return this.downloadFile(dropboxPath, localDirectory);
            }
            throw error;
        }
    }
}
