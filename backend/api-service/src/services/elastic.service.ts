/**
 * @fileoverview Elasticsearch service for managing search operations
 * Handles connection and search functionality for document retrieval
 *
 * Features:
 * - Fuzzy text search
 * - Filename pattern matching
 * - Result highlighting
 * - Error handling with retries
 */

import { Client } from "@elastic/elasticsearch";
import {
  ELASTIC_PASSWORD,
  ELASTIC_USERNAME,
  ELASTICSEARCH_URL,
  FILE_INDEX_NAME,
} from "../constants/app.constants";
import type {
  ISearchRequest,
  ISearchResponse,
  IElasticsearchHitSource,
  IElasticsearchSearchResponse,
} from "../interfaces/search.interface";
import { SortOrder } from "../enums/sort.enum";
import { handleErrors, ElasticsearchError } from "../utils/error.decorator";
import { logInfo, logDebug } from "../utils/logger";

interface IElasticsearchHit {
  _source: {
    filename: string;
    url: string;
    text: string;
    createdAt: string;
  };
  _score: number;
  highlight?: Record<string, string[]>;
}

export class ElasticService {
  private client: Client;

  constructor() {
    logInfo("Initializing ElasticService");
    this.client = new Client({
      node: ELASTICSEARCH_URL,
      auth: {
        username: ELASTIC_USERNAME,
        password: ELASTIC_PASSWORD,
      },
    });
  }

  /**
   * Search for files based on query
   * Supports fuzzy matching and pattern matching on filenames
   *
   * @param searchRequest - Search parameters
   * @returns Promise resolving to search results
   * @throws {ElasticsearchError} If search operation fails
   */
  @handleErrors({
    transformError: (error) =>
      new ElasticsearchError("Search operation failed", 500, error),
  })
  async searchFiles(searchRequest: ISearchRequest): Promise<any> {
    logDebug("Starting file search", { query: searchRequest.query });

    const response: IElasticsearchSearchResponse | any =
      await this.client.search<IElasticsearchSearchResponse>({
        index: FILE_INDEX_NAME,
        body: this.buildSearchQuery(
          searchRequest.query.trim(),
          searchRequest.sort
        ),
      });

    logInfo("Search completed", {
      query: searchRequest.query,
      resultCount: response.hits.hits.length,
    });

    return response.hits.hits.map((hit: IElasticsearchHit) => ({
      filename: hit._source.filename,
      url: hit._source.url,
      text: hit._source.text,
      createdAt: hit._source.createdAt,
    }));
  }

  private buildSearchQuery(
    queryString: string,
    sort?: SortOrder
  ): Record<string, unknown> {
    return {
      sort: queryString
        ? [
            { _score: { order: "desc" } },
            { createdAt: { order: sort || SortOrder.DESC } },
          ]
        : [{ createdAt: { order: sort || SortOrder.DESC } }],
      query: queryString
        ? {
            bool: {
              should: [
                {
                  regexp: {
                    filename: {
                      value: `.*${queryString}.*`,
                      case_insensitive: true,
                      boost: 2.0,
                    },
                  },
                },
                {
                  match: {
                    text: {
                      query: queryString,
                      analyzer: "custom_analyzer",
                      fuzziness: "AUTO",
                      operator: "and",
                      boost: 1.0,
                    },
                  },
                },
              ],
              minimum_should_match: 1,
            },
          }
        : {
            match_all: {},
          },
      highlight: {
        fields: {
          text: {},
        },
      },
    };
  }
}
