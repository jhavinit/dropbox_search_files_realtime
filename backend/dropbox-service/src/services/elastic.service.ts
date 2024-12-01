import { Client } from "@elastic/elasticsearch";
import { handleErrors } from "../utils/error.decorator";
import { logger } from "../utils/logger";
import { IFileMetadata } from "../interfaces/file.interface";
import {
  ELASTIC_PASSWORD,
  ELASTIC_USERNAME,
  ELASTICSEARCH_URL,
  FILE_INDEX_NAME,
} from "../constants/app.constants";

export class ElasticService {
  private client: Client;

  constructor() {
    this.client = new Client({
      node: ELASTICSEARCH_URL,
      auth: {
        username: ELASTIC_USERNAME, // Replace with your username (if using basic auth)
        password: ELASTIC_PASSWORD, // Replace with your password (if using basic auth)
      },
    });
  }

  @handleErrors()
  async fileExists(filename: string): Promise<boolean> {
    const response: any = await this.client.search({
      index: FILE_INDEX_NAME,
      body: {
        query: {
          match: {
            filename: filename,
          },
        },
      },
    });
    return response?.hits?.total?.value > 0;
  }

  @handleErrors()
  async indexFile(
    filename: string,
    url: string,
    data: string,
    createdAt: Date
  ): Promise<void> {
    const metadata: IFileMetadata = {
      filename,
      url,
      text: data,
      createdAt,
    };

    // Index into Elasticsearch
    await this.client.index({
      index: FILE_INDEX_NAME,
      body: metadata,
    });

    logger.info(`Indexed: ${metadata.filename}`);
  }

  @handleErrors()
  async createIndex(): Promise<void> {
    const indexExists = await this.client.indices.exists({
      index: FILE_INDEX_NAME,
    });

    if (!indexExists) {
      await this.client.indices.create({
        index: FILE_INDEX_NAME,
        settings: {
          "index.max_ngram_diff": 7,
          analysis: {
            analyzer: {
              custom_analyzer: {
                type: "custom",
                tokenizer: "standard",
                filter: ["lowercase", "synonym_filter", "ngram_filter"],
              },
              search_analyzer: {
                type: "custom",
                tokenizer: "standard",
                filter: ["lowercase", "synonym_filter"],
              },
            },
            filter: {
              synonym_filter: {
                type: "synonym",
                synonyms: [
                  "hi, hello", // Add more synonyms as needed
                ],
              },
              ngram_filter: {
                type: "ngram",
                min_gram: 3,
                max_gram: 10,
              },
            },
          },
        },
        mappings: {
          properties: {
            text: {
              type: "text",
              analyzer: "custom_analyzer",
              search_analyzer: "search_analyzer",
            },
            filename: {
              type: "keyword",
            },
            url: {
              type: "keyword",
            },
            createdAt: {
              type: "date",
            },
          },
        },
      });
      logger.info(`Created index: ${FILE_INDEX_NAME}`);
    } else {
      logger.info(`Index ${FILE_INDEX_NAME} already exists`);
    }
  }

  // @handleErrors()
  // async createIndex(): Promise<void> {
  //     const indexExists = await this.client.indices.exists({
  //         index: FILE_INDEX_NAME,
  //     });
  //     if (!indexExists.body) {
  //         await this.client.indices.create({
  //             index: FILE_INDEX_NAME,
  //             body: {
  //                 "settings": {
  //                     "index.max_ngram_diff": 7,
  //                   "analysis": {
  //                     "analyzer": {
  //                       "custom_analyzer": {
  //                         "tokenizer": "standard",
  //                         "filter": [
  //                           "lowercase",
  //                           "synonym_filter",
  //                           "ngram_filter"
  //                         ]
  //                       },
  //                       "search_analyzer": {
  //                         "tokenizer": "standard",
  //                         "filter": [
  //                           "lowercase",
  //                           "synonym_filter"
  //                         ]
  //                       }
  //                     },
  //                     "filter": {
  //                       "synonym_filter": {
  //                         "type": "synonym",
  //                         "synonyms": [
  //                           "hi, hello"  // Add more synonyms as needed
  //                         ]
  //                       },
  //                       "ngram_filter": {
  //                         "type": "ngram",
  //                         "min_gram": 3,
  //                         "max_gram": 10
  //                       }
  //                     }
  //                   }
  //                 },
  //                 "mappings": {
  //                   "properties": {
  //                     "text": {
  //                       "type": "text",
  //                       "analyzer": "custom_analyzer",
  //                       "search_analyzer": "search_analyzer"
  //                     },
  //                     "filename": {
  //                       "type": "keyword"
  //                     },
  //                     "url": {
  //                       "type": "keyword"
  //                     }
  //                   }
  //                 }
  //               }
  //         });
  //         logger.info(`Created index: ${FILE_INDEX_NAME}`);
  //     } else {
  //         logger.info(`Index ${FILE_INDEX_NAME} already exists`);
  //     }
  // }
}
