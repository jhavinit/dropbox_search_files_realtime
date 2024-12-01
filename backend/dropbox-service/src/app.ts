/**
 * @fileoverview Main application entry point for the Dropbox to Elasticsearch sync service.
 * This service periodically syncs files from Dropbox to Elasticsearch, making them searchable.
 *
 * Features:
 * - Automatic file syncing from Dropbox
 * - Text extraction from various file formats
 * - Elasticsearch indexing for search capabilities
 * - Health check endpoint for monitoring
 *
 * Environment Variables:
 * - PORT: Server port number (default: 3002)
 * - SYNC_INTERVAL: Sync interval in milliseconds (default: 30 minutes)
 */

import express, { Request, Response } from "express";
import { DropboxService } from "./services/dropbox.service";
import { logInfo, logError, logDebug } from "./utils/logger";
import { extractText } from "./services/text-extract.service";
import path from "path";
import { DOWNLOADS_DIRECTORY } from "./constants/app.constants";
import { ElasticService } from "./services/elastic.service";

// Constants
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3002;
const SYNC_INTERVAL = process.env.SYNC_INTERVAL
  ? parseInt(process.env.SYNC_INTERVAL)
  : 30 * 60 * 1000; // 30 minutes

// Initialize services
const dropboxService = new DropboxService();
const elasticService = new ElasticService();

// Initialize express app
const app = express();

/**
 * Synchronizes files from Dropbox to Elasticsearch
 *
 * Process:
 * 1. Ensures Elasticsearch index exists
 * 2. Fetches all files from Dropbox
 * 3. For each file:
 *    - Checks if already indexed
 *    - Downloads and extracts text if new
 *    - Indexes the file content
 *
 * Error Handling:
 * - Individual file failures don't stop the sync process
 * - All errors are logged with context
 * - Failed files are tracked in sync summary
 *
 * @returns {Promise<void>} Resolves when sync is complete
 * @throws {Error} Errors are caught and logged, not thrown
 */
async function syncDropboxToElastic(): Promise<void> {
  logInfo("Starting Dropbox to Elasticsearch sync");

  try {
    // Ensure Elasticsearch index exists
    await elasticService.createIndex();
    logDebug("Elasticsearch index ready");

    // Fetch file metadata from Dropbox
    logInfo("Fetching files from Dropbox");
    const files = await dropboxService.getFiles();
    logInfo(`Found ${files.length} files in Dropbox`);

    // Process each file
    let processedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const file of files) {
      try {
        // Check if file already exists in Elasticsearch
        const exists = await elasticService.fileExists(file.name);
        if (exists) {
          logDebug(`Skipping existing file`, { fileName: file.name });
          skippedCount++;
          continue;
        }

        // Extract text from downloaded file
        const filePath = path.join(
          __dirname,
          `../${DOWNLOADS_DIRECTORY}/${file.path_lower}`
        );
        logDebug(`Extracting text from file`, {
          fileName: file.name,
          filePath,
        });

        const content = await extractText(filePath);
        if (content.length > 0) {
          // Index file in Elasticsearch
          logInfo(`Indexing new file`, { fileName: file.name });
          await elasticService.indexFile(
            file.name,
            file.url,
            content,
            new Date()
          );
        } else {
          logInfo(`File format not supported or empty`, {
            fileName: file.name,
          });
        }

        processedCount++;
      } catch (error) {
        errorCount++;
        logError(
          `Failed to process file`,
          error instanceof Error ? error : undefined,
          {
            fileName: file.name,
            step: "file_processing",
          }
        );
        // Continue with next file
        continue;
      }
    }

    // Log sync summary
    logInfo("Sync completed", {
      totalFiles: files.length,
      processed: processedCount,
      skipped: skippedCount,
      errors: errorCount,
    });
  } catch (error) {
    logError("Sync failed", error instanceof Error ? error : undefined, {
      step: "sync_process",
    });
    // Don't rethrow as this is a top-level function
  }
}

/**
 * Health check endpoint
 * Returns server status and current timestamp
 *
 * @route GET /health
 * @returns {Object} Status object
 * @returns {string} status - Always 'ok' if server is running
 * @returns {string} timestamp - Current ISO timestamp
 */
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Start the server
app.listen(PORT, () => {
  logInfo(`Server started`, {
    port: PORT,
    syncInterval: `${SYNC_INTERVAL / 1000 / 60} minutes`,
  });

  // Run initial sync
  syncDropboxToElastic().catch((error) => {
    logError("Initial sync failed", error instanceof Error ? error : undefined);
  });

  // Schedule periodic sync
  setInterval(() => {
    syncDropboxToElastic().catch((error) => {
      logError(
        "Scheduled sync failed",
        error instanceof Error ? error : undefined
      );
    });
  }, SYNC_INTERVAL);
});
