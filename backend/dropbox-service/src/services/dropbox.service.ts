import { Dropbox } from "dropbox";
import { handleErrors } from "../utils/error.decorator";
import { logger } from "../utils/logger";
import * as fs from "fs";
import * as path from "path";
import { DropboxFile } from "../interfaces/dropbox.interface";
import { DOWNLOADS_DIRECTORY } from "../constants/app.constants";

export class DropboxService {
    private dropbox: Dropbox;

    constructor() {
        this.dropbox = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
    }

    @handleErrors()
    async getFiles(folderPath: string = ""): Promise<DropboxFile[]> {
        const response = await this.dropbox.filesListFolder({ path: folderPath });
        console.log("Response: ", response.result.entries);

        const files: DropboxFile[] = [];
        for (const entry of response.result.entries) {
            if (entry[".tag"] === "file") {
                await this.downloadFile(entry.path_lower as string, DOWNLOADS_DIRECTORY);
                files.push({
                    name: entry.name,
                    path_lower: entry.path_lower as string,
                    url: entry.path_lower as string,
                });
            }
        }

        logger.info(`Fetched ${files.length} files from Dropbox.`);
        return files;
    }

    @handleErrors()
    async downloadFile(dropboxPath: string, localDirectory: string): Promise<void> {
            const response = await this.dropbox.filesDownload({ path: dropboxPath });
            if (!("fileBinary" in response.result)) {
                throw new Error("File content missing in response.");
            }

            const fileName = path.basename(dropboxPath);
            const localPath = path.join(path.join(__dirname,`../../${localDirectory}`), fileName);

            fs.writeFileSync(localPath, response.result.fileBinary as Buffer);
            logger.info(`File downloaded successfully: ${localPath}`);
    }
}
