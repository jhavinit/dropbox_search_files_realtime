"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { DropboxService } from "./services/dropbox.service";
// import { ElasticService } from "./services/elastic.service";
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("./utils/logger");
dotenv_1.default.config();
(function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("DROPBOX_ACCESS_TOKEN>>", process.env.DROPBOX_ACCESS_TOKEN);
            // const dropboxService = new DropboxService();
            // const elasticService = new ElasticService();
            // // Fetch file metadata from Dropbox
            // logger.info("Fetching file metadata from Dropbox...");
            // const files = await dropboxService.getFiles();
            // // Store file metadata in Elasticsearch
            // logger.info("Indexing file metadata to Elasticsearch...");
            // await elasticService.indexFiles(files);
            // logger.info("Process completed successfully!");
        }
        catch (error) {
            logger_1.logger.error("An error occurred:", error);
        }
    });
})();
