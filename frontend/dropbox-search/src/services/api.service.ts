/**
 * API service for handling all backend communication
 */

import axios, { AxiosError } from "axios";
import { SearchResult, ApiResponse } from "../types";
import { SortOrder } from "../enums/sort.enum";
import config from "../config/config";

const API_URL = `${config.apiUrl}:${config.apiPort}`;

class ApiService {
  private static instance: ApiService;
  private baseURL: string;

  private constructor() {
    this.baseURL = API_URL;
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  /**
   * Search for files in Dropbox
   * @param query Search query string
   * @param sort Sort order for results
   * @returns Promise with search results
   */
  public async searchFiles(
    query: string,
    sort: SortOrder = SortOrder.DESC
  ): Promise<ApiResponse<SearchResult[]>> {
    try {
      const response = await axios.get<SearchResult[]>(
        `${this.baseURL}/api/search`,
        {
          params: {
            query: encodeURIComponent(query),
            sort,
          },
        }
      );
      return { data: response.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        data: [],
        error: {
          message: "Failed to fetch search results",
          code: axiosError.code,
          details: axiosError.response?.data,
        },
      };
    }
  }
}

export const apiService = ApiService.getInstance();
