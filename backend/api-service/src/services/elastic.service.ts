import { ApiResponse, Client } from '@elastic/elasticsearch';
import { ELASTICSEARCH_URL, FILE_INDEX_NAME } from '../constants/app.constants';
import { SearchRequest, SearchResponse } from '../interfaces/search.interface';

interface ElasticsearchHitSource {
    filename: string;
    url: string;
    text: string;
}

interface ElasticsearchHit {
    _source: ElasticsearchHitSource;
    _score: number;
}

interface ElasticsearchSearchResponse {
    hits: {
        hits: ElasticsearchHit[];
    };
}

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
            console.log('Successfully connected to Elasticsearch');
        } catch (error) {
            if (retryCount >= this.maxRetries) {
                console.error('Max retries reached. Could not connect to Elasticsearch');
                throw new Error('Failed to connect to Elasticsearch after multiple retries');
            }

            console.log(`Connection attempt ${retryCount + 1} failed. Retrying in ${this.retryDelay/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            
            // Create a new client instance for the retry
            this.client = this.createClient();
            await this.waitForConnection(retryCount + 1);
        }
    }

    async searchFiles(searchRequest: SearchRequest): Promise<SearchResponse[]> {
            const response: ApiResponse<ElasticsearchSearchResponse, unknown> = await this.client.search<ElasticsearchSearchResponse>({
                index: FILE_INDEX_NAME,
                body: {
                    query: searchRequest.query.trim() 
                        ? {
                            multi_match: {
                                query: searchRequest.query,
                                fields: [
                                    "text",
                                    "filename^2"
                                ],
                                fuzziness: "AUTO"
                            }
                        }
                        : {
                            match_all: {}
                        },
                    highlight: {
                        fields: {
                            text: {}
                        }
                    },
                    size: 100 // Limit to prevent overwhelming results
                }
            });

            return response.body.hits.hits.map((hit: ElasticsearchHit) => ({
                filename: hit._source.filename,
                url: hit._source.url,
                text: hit._source.text,
                score: hit._score
            }));
        
    }
}
