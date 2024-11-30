import { DropboxService } from "./services/dropbox.service";
import { logger } from "./utils/logger";
import { extractText } from "./services/text-extract.service";
import path from "path";
import { DOWNLOADS_DIRECTORY } from "./constants/app.constants";
import { ElasticService } from "./services/elastic.service";

(async function main() {
    try {

        const dropboxService = new DropboxService();
        const elasticService = new ElasticService();

        // create index
        await elasticService.createIndex();

        // Fetch file metadata from Dropbox
        logger.info("Fetching file metadata from Dropbox...");
        // const files = await dropboxService.getFiles();
        // console.log(files);
        const files = [
            {
                name: "doc3_txt.txt",
                path_lower: "doc3_txt.txt",
                url: "doc3_txt.txt",
            }            
        ];

        // read content from file and insert in elastic
        for (let file of files) {
            const content = await extractText(path.join(__dirname, `../${DOWNLOADS_DIRECTORY}/${file.path_lower}`));
            // console.log(content);
            logger.info("Indexing file metadata to Elasticsearch...");
            await elasticService.indexFile(file.name, file.url, content);
        }
    } catch (error) {
        logger.error("An error occurred:", error);
    }
})();
