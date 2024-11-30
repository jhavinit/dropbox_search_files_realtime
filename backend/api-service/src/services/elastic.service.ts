import { Client } from '@elastic/elasticsearch';
import { ELASTIC_PASSWORD, ELASTIC_USERNAME, ELASTICSEARCH_URL, FILE_INDEX_NAME } from '../constants/app.constants';
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

    constructor() {

        this.client = new Client({ 
            node: ELASTICSEARCH_URL,
            auth: {
                    username: ELASTIC_USERNAME,      // Replace with your username (if using basic auth)
                    password: ELASTIC_PASSWORD       // Replace with your password (if using basic auth)
                // apiKey: ELASTIC_KEY
              },
        });
        // this.getAllIndices();
    }

    // async getAllIndices(): Promise<any> {
    //     try {
    //         console.log('called');
    //         console.log(await this.client.cat.indices({ format: 'json' }));
    //     } catch(error) {
    //         console.log(error)
    //     }

    // }

    async searchFiles(searchRequest: SearchRequest): Promise<SearchResponse[]> {
            const response: any = await this.client.search<ElasticsearchSearchResponse>({
                index: FILE_INDEX_NAME,
                body: {
                    query: searchRequest.query.trim() 
                        ? {
                              "bool": {
                                "should": [
                                  {
                                    "regexp": {
                                      "filename": {
                                        "value": ".*" + searchRequest.query.trim() + ".*",
                                        "case_insensitive": true
                                      }
                                    }
                                  },
                                  {
                                    "match": {
                                      "text": {
                                        "query": searchRequest.query.trim(),
                                        "analyzer": "custom_analyzer",
                                        "fuzziness": "AUTO",         
                                        "operator": "and"
                                      }
                                    }
                                  }
                                ],
                                "minimum_should_match": 1
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
                    // size: 100 // Limit to prevent overwhelming results
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
