"use strict";
// import { Dropbox } from "dropbox";
// import { handleErrors } from "../utils/error.decorator";
// import { logger } from "../utils/logger";
// interface DropboxFile {
//     name: string;
//     path_lower: string;
//     url: string;
// }
// export class DropboxService {
//     private dropbox: Dropbox;
//     constructor() {
//         this.dropbox = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
//     }
//     @handleErrors()
//     async getFiles(folderPath: string = ""): Promise<DropboxFile[]> {
//         const response = await this.dropbox.filesListFolder({ path: folderPath });
//         const files: DropboxFile[] = [];
//         for (const entry of response.result.entries) {
//             if (entry[".tag"] === "file") {
//                 const fileLink = await this.dropbox.sharingCreateSharedLink({ path: entry.path_lower });
//                 files.push({
//                     name: entry.name,
//                     path_lower: entry.path_lower,
//                     url: fileLink.result.url.replace("?dl=0", "?dl=1"), // Direct download link
//                 });
//             }
//         }
//         logger.info(`Fetched ${files.length} files from Dropbox.`);
//         return files;
//     }
// }
