/**
 * @fileoverview Application constants and configuration values
 * Contains environment variables and static configuration
 *
 * Environment Variables Required:
 * - PORT: Server port number
 * - ELASTICSEARCH_URL: URL for Elasticsearch connection
 * - ELASTIC_USERNAME: Elasticsearch username for authentication
 * - ELASTIC_PASSWORD: Elasticsearch password for authentication
 */

// import dotenv from 'dotenv';
// dotenv.config();

/** Server configuration */
export const PORT = process.env.PORT || "3001";

/** Elasticsearch connection configuration */
export const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL as string;
export const ELASTIC_USERNAME = process.env.ELASTIC_USERNAME as string;
export const ELASTIC_PASSWORD = process.env.ELASTIC_PASSWORD as string;

/** Index name for file storage */
export const FILE_INDEX_NAME = "files";

// Validate required environment variables
const requiredEnvVars = [
  "ELASTICSEARCH_URL",
  "ELASTIC_USERNAME",
  "ELASTIC_PASSWORD",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
