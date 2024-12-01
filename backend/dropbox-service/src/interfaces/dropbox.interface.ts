/**
 * @fileoverview Dropbox interfaces
 * Contains type definitions for Dropbox API interactions
 */

/**
 * Represents a file in Dropbox with its metadata
 */
export interface IDropboxFile {
    /** Name of the file including extension */
    name: string;
    /** Lowercase path of the file in Dropbox */
    path_lower: string;
    /** URL or path used to access the file */
    url: string;
}

/**
 * Interface for managing Dropbox authentication tokens
 */
export interface ITokenInfo {
    /** Current access token */
    accessToken: string;
    /** Refresh token for obtaining new access tokens */
    refreshToken: string;
    /** Timestamp when the current access token expires */
    expiresAt: number;
}

/**
 * Interface for Dropbox API token refresh response
 */
export interface IDropboxResponse {
    /** New access token */
    access_token: string;
    /** Optional new refresh token */
    refresh_token?: string;
    /** Token validity duration in seconds */
    expires_in: number;
}
