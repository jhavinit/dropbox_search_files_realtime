/**
 * Common types used across the application
 */

export interface SearchResult {
  filename: string;
  url: string;
  text: string;
  createdAt: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T;
  error?: ApiError;
}
