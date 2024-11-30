import { Client } from "@elastic/elasticsearch";
import { handleErrors } from "../utils/error.decorator";
import { logger } from "../utils/logger";
import { IFileMetadata } from "../interfaces/file.interface";
import { ELASTICSEARCH_URL, FILE_INDEX_NAME } from "../constants/app.constants";

export class ElasticService {
    private client: Client;

    constructor() {
        this.client = new Client({
            node: ELASTICSEARCH_URL,
        });
    }

    @handleErrors()
    async indexFile(filename: string, url: string, data: string): Promise<void> {
        const metadata: IFileMetadata = {
            filename, 
            url,
            text: data, 
        };

        // Index into Elasticsearch
        await this.client.index({
            index: FILE_INDEX_NAME,
            body: metadata,
        });

        logger.info(`Indexed: ${metadata.filename}`);
    };

    @handleErrors()
    async createIndex(): Promise<void> {
        const indexExists = await this.client.indices.exists({
            index: FILE_INDEX_NAME,
        });
        if (!indexExists.body) {
            await this.client.indices.create({
                index: FILE_INDEX_NAME,
                body: {
                    mappings: {
                        properties: {
                            filename: { type: 'keyword' },
                            url: { type: 'keyword' },
                            text: { 
                                type: 'text',
                            }
                        }
                    }
                }
            });
            logger.info(`Created index: ${FILE_INDEX_NAME}`);
        } else {
            logger.info(`Index ${FILE_INDEX_NAME} already exists`);
        }
    }    
}
