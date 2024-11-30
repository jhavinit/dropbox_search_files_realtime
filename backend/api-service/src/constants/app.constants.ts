import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const ELASTICSEARCH_URL = 'http://localhost:9200';
export const FILE_INDEX_NAME = 'files';
