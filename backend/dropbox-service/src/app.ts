import { DropboxService } from "./services/dropbox.service";
import { logger } from "./utils/logger";
import { extractText } from "./services/text-extract.service";
import path from "path";
import { DOWNLOADS_DIRECTORY } from "./constants/app.constants";
import { ElasticService } from "./services/elastic.service";
import express from 'express';

// Initialize express app
const app = express();
const PORT = 3002;

async function syncDropboxToElastic() {
    try {
        const dropboxService = new DropboxService();
        const elasticService = new ElasticService();

        // create index if it doesn't exist
        await elasticService.createIndex();

        // Fetch file metadata from Dropbox
        logger.info("Fetching file metadata from Dropbox...");
        const files = await dropboxService.getFiles();

        // read content from file and insert in elastic
        for (let file of files) {
            // Check if file already exists in Elasticsearch
            const exists = await elasticService.fileExists(file.name);
            if (exists) {
                logger.info(`File ${file.name} already exists in Elasticsearch, skipping...`);
                continue;
            }

            const content = await extractText(path.join(__dirname, `../${DOWNLOADS_DIRECTORY}/${file.path_lower}`));
            logger.info(`Indexing new file ${file.name} to Elasticsearch...`);
            await elasticService.indexFile(file.name, file.url, content);
        }
        logger.info("Sync completed successfully");
    } catch (error) {
        logger.error("An error occurred during sync:", error);
    }
}

// Basic health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    
    // Run initial sync
    syncDropboxToElastic();
    
    // Schedule sync every 30 minutes
    setInterval(syncDropboxToElastic, 30 * 60 * 1000);
});
