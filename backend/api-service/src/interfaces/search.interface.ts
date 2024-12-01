import { SortOrder } from "../enums/sort.enum";

export interface ISearchResponse {
  hits: {
    total: number;
    hits: Array<{
      source: Record<string, unknown>;
    }>;
  };
}

export interface ISearchRequest {
  query: string;
  filters?: Record<string, string[]>;
  sort?: SortOrder;
}

export interface IElasticsearchHitSource {
  filename: string;
  url: string;
  text: string;
  createdAt: string;
}

export interface IElasticsearchHit {
  source: IElasticsearchHitSource;
  score: number;
}

export interface IElasticsearchSearchResponse {
  hits: {
    total: {
      value: number;
    };
    hits: Array<{
      _source: IElasticsearchHitSource;
      _score: number;
    }>;
  };
}
