import dotenv from "dotenv";
dotenv.config();


export const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN as string;
export const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL as string;
export const DOWNLOADS_DIRECTORY = process.env.DOWNLOADS_DIRECTORY as string;