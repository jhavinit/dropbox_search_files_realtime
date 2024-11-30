import * as dotenv from 'dotenv';
dotenv.config();

export const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN as string
export const DROPBOX_REFRESH_TOKEN = process.env.DROPBOX_REFRESH_TOKEN as string
export const DROPBOX_APP_KEY = process.env.DROPBOX_APP_KEY as string
export const DROPBOX_APP_SECRET = process.env.DROPBOX_APP_SECRET as string

export const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL as string;
export const DOWNLOADS_DIRECTORY = process.env.DOWNLOADS_DIRECTORY as string;
export const FILE_INDEX_NAME = 'files'