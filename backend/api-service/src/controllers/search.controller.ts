/**
 * @fileoverview Search controller for handling search-related HTTP requests
 * Manages validation, error handling, and response formatting for search operations
 */

import { Request, Response } from "express";
import { ElasticService } from "../services/elastic.service";
import { ISearchRequest } from "../interfaces/search.interface";
import { SortOrder } from "../enums/sort.enum";
import { logInfo, logError } from "../utils/logger";

class SearchController {
  private elasticService: ElasticService;

  constructor() {
    this.elasticService = new ElasticService();
  }

  search = async (req: Request, res: Response): Promise<void> => {
    try {
      const { query = "", sort } = req.query;

      const searchRequest: ISearchRequest = {
        query: query as string,
        sort: sort as SortOrder,
      };

      logInfo("Processing search request", { query, sort });
      const results = await this.elasticService.searchFiles(searchRequest);

      res.json(results);
    } catch (error: any) {
      logError("Search failed", error);
      res.status(500).json({
        data: null,
        error: {
          message: "Failed to process search request",
          details: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  };
}

export const searchController = new SearchController();
