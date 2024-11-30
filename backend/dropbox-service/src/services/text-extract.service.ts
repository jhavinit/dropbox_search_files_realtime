import textract from 'textract';
import pdfParse from 'pdf-parse';
import fs from 'fs';

export const extractText = (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (filePath.endsWith('.pdf')) {
            return extractTextFromPDF(filePath).then(resolve).catch(reject);
        }

        textract.fromFileWithPath(filePath, (error, text) => {
            if (error) {
                reject(error);
            } else {
                resolve(text || '');
            }
        });
    });
};

export const extractTextFromPDF = async (filePath: string): Promise<string> => {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
};