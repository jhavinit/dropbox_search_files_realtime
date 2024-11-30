export interface SearchResponse {
    filename: string;
    url: string;
    text: string;
    score?: number;
}

export interface SearchRequest {
    query: string;
    limit?: number;
}
