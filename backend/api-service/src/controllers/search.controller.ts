import { Request, Response } from 'express';
import { ElasticService } from '../services/elastic.service';
import { SearchRequest } from '../interfaces/search.interface';

export class SearchController {
    private elasticService: ElasticService;

    constructor() {
        this.elasticService = new ElasticService();
    }

    search = async (req: Request, res: Response): Promise<void> => {
        try {
            const searchRequest: SearchRequest = {
                query: req.query.q as string,
                limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
            };

            // if (!searchRequest.query) {
            //     res.status(400).json({ error: 'Search query is required' });
            //     return;
            // }

            const results = await this.elasticService.searchFiles(searchRequest);
            res.json(results);
        } catch (error) {
            console.error('Search error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}
