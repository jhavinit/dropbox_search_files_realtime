/**
 * @fileoverview Application constants and configuration values
 * Contains environment variables and static configuration
 * 
 * Environment Variables Required:
 * - DROPBOX_ACCESS_TOKEN
 * - DROPBOX_REFRESH_TOKEN
 * - DROPBOX_APP_KEY
 * - DROPBOX_APP_SECRET
 * - ELASTICSEARCH_URL
 * - ELASTIC_USERNAME
 * - ELASTIC_PASSWORD
 */

/** Directory where downloaded files are stored */
export const DOWNLOADS_DIRECTORY = process.env.DOWNLOADS_DIRECTORY as string;

/** Dropbox authentication tokens and app credentials */
export const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN as string;
export const DROPBOX_REFRESH_TOKEN = process.env.DROPBOX_REFRESH_TOKEN as string;
export const DROPBOX_APP_KEY = process.env.DROPBOX_APP_KEY as string;
export const DROPBOX_APP_SECRET = process.env.DROPBOX_APP_SECRET as string;

/** Elasticsearch connection configuration */
export const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL as string;
export const ELASTIC_USERNAME = process.env.ELASTIC_USERNAME as string;
export const ELASTIC_PASSWORD = process.env.ELASTIC_PASSWORD as string;

/** Index name for file storage */
export const FILE_INDEX_NAME = 'files';

// Validate required environment variables
const requiredEnvVars = [
    'DROPBOX_ACCESS_TOKEN',
    'DROPBOX_REFRESH_TOKEN',
    'DROPBOX_APP_KEY',
    'DROPBOX_APP_SECRET',
    'ELASTICSEARCH_URL',
    'ELASTIC_USERNAME',
    'ELASTIC_PASSWORD',
    'DOWNLOADS_DIRECTORY'
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}
