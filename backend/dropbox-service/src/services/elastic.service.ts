import { Client } from "@elastic/elasticsearch";
import { handleErrors } from "../utils/error.decorator";
import { logger } from "../utils/logger";
import { IFileMetadata } from "../interfaces/file.interface";
import { ELASTICSEARCH_URL, FILE_INDEX_NAME } from "../constants/app.constants";

export class ElasticService {
    private client: Client;
    private maxRetries = 30;
    private retryDelay = 5000; // 5 seconds

    constructor() {
        this.client = this.createClient();
        this.waitForConnection();
    }

    private createClient(): Client {
        return new Client({ 
            node: ELASTICSEARCH_URL,
            maxRetries: this.maxRetries,
            requestTimeout: 10000,
            sniffOnStart: true,
        });
    }

    private async waitForConnection(retryCount = 0): Promise<void> {
        try {
            await this.client.ping();
            logger.info('Successfully connected to Elasticsearch');
        } catch (error) {
            if (retryCount >= this.maxRetries) {
                logger.error('Max retries reached. Could not connect to Elasticsearch');
                throw new Error('Failed to connect to Elasticsearch after multiple retries');
            }

            logger.info(`Connection attempt ${retryCount + 1} failed. Retrying in ${this.retryDelay/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            
            // Create a new client instance for the retry
            this.client = this.createClient();
            await this.waitForConnection(retryCount + 1);
        }
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
