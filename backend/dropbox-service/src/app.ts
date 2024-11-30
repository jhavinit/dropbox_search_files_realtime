import { DropboxService } from "./services/dropbox.service";
// import { ElasticService } from "./services/elastic.service";
import dotenv from "dotenv";
import { logger } from "./utils/logger";
dotenv.config();

(async function main() {
    try {
        const dropboxService = new DropboxService();
        // const elasticService = new ElasticService();

        // Fetch file metadata from Dropbox
        logger.info("Fetching file metadata from Dropbox...");
        const files = await dropboxService.getFiles();
        // console.log(files);

        // // Store file metadata in Elasticsearch
        // logger.info("Indexing file metadata to Elasticsearch...");
        // await elasticService.indexFiles(files);

        // logger.info("Process completed successfully!");
    } catch (error) {
        logger.error("An error occurred:", error);
    }
})();
