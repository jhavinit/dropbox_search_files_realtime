// import { Client } from "@elastic/elasticsearch";
// import { handleErrors } from "../utils/error.decorator";
// import { logger } from "../utils/logger";

// export class ElasticService {
//     private client: Client;

//     constructor() {
//         this.client = new Client({ node: process.env.ELASTICSEARCH_URL });
//     }

//     @handleErrors()
//     async indexFiles(files: any[]): Promise<void> {
//         const bulkOperations = files.flatMap(file => [
//             { index: { _index: "files", _id: file.path_lower } },
//             file,
//         ]);

//         const result = await this.client.bulk({ body: bulkOperations });

//         if (result.errors) {
//             const erroredDocuments = result.items.filter(item => item.index && item.index.error);
//             logger.error("Failed to index some documents:", erroredDocuments);
//         }

//         logger.info(`Indexed ${files.length} files to Elasticsearch.`);
//     }
// }
