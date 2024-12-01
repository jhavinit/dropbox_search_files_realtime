/**
 * @fileoverview Text extraction service for processing various file formats
 * Extracts text content from different file types for indexing.
 *
 * Supported File Types:
 * - PDF documents
 * - Microsoft Office documents
 * - Text files
 * - And other formats supported by textract
 *
 * Features:
 * - Automatic file type detection
 * - Error handling with retries
 * - Structured logging
 */

import textract from "textract";
import { promisify } from "util";
import { logError, logDebug } from "../utils/logger";
import { handleErrors } from "../utils/error.decorator";
import { spawn } from "child_process";
import fs from "fs";

// Convert textract.fromFileWithPath to Promise-based function
const extractFromFile = promisify(textract.fromFileWithPath);

/**
 * Extract text content from a file
 * Automatically detects file type and uses appropriate extraction method
 *
 * @param filePath - Absolute path to the file
 * @returns Promise resolving to extracted text content
 * @throws {Error} If text extraction fails
 *
 * @example
 * ```typescript
 * const text = await extractText('/path/to/document.pdf');
 * ```
 */
export async function extractText(filePath: string): Promise<string> {
  try {
    logDebug("Starting text extraction", { filePath });
    if (filePath.endsWith(".pdf")) {
      return extractTextFromPDF(filePath);
    } else if (filePath.endsWith(".txt") || filePath.endsWith(".docx")) {
      const text = await extractFromFile(filePath);
      return typeof text === "string" ? text : "";
    }
    return "";
  } catch (error) {
    logError(
      "Text extraction failed",
      error instanceof Error ? error : undefined,
      {
        filePath,
      }
    );
    throw new Error(
      `Failed to extract text from file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// function fixSpacing(text: string): string {
//   // Simple approach to add space between words with no obvious delimiter
//   return text
//     .replace(/(\w)([A-Z])/g, "$1 $2") // Add space between a lowercase letter and uppercase letter
//     .replace(/(\w)([0-9])/g, "$1 $2") // Add space between a letter and a digit
//     .replace(/([a-zA-Z])([.,])/g, "$1 $2") // Add space between a letter and punctuation
//     .replace(/([.,])(\w)/g, "$1 $2") // Add space between punctuation and a word
//     .replace(/([a-z])([A-Z])/g, "$1 $2"); // Add space between lowercase and uppercase
// }

/**
 * Extract text content from a PDF file
 *
 * @param filePath - Absolute path to the PDF file
 * @returns Promise resolving to extracted text content
 * @throws {Error} If text extraction fails
 */
// export async function extractTextFromPDF(filePath: string): Promise<string> {
//   try {
//     logDebug("Starting PDF text extraction", { filePath });
//     const dataBuffer = fs.readFileSync(filePath);
//     const data = await pdfParse(dataBuffer);
//     const cleanedText = fixSpacing(data.text);
//     return cleanedText;
//   } catch (error) {
//     logError(
//       "PDF text extraction failed",
//       error instanceof Error ? error : undefined,
//       {
//         filePath,
//       }
//     );
//     throw new Error(
//       `Failed to extract text from PDF file: ${
//         error instanceof Error ? error.message : "Unknown error"
//       }`
//     );
//   }
// }
export async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    logDebug("Starting PDF text extraction", { filePath });

    // Call Python script for PDF extraction
    const pythonScript = `${__dirname}/extract-pdf-service.py`;

    return new Promise((resolve, reject) => {
      const pythonProcess = spawn("python3", [pythonScript, filePath]);
      let outputData = "";
      let errorData = "";

      pythonProcess.stdout.on("data", (data: { toString: () => string }) => {
        outputData += data.toString();
      });

      pythonProcess.stderr.on("data", (data: { toString: () => string }) => {
        errorData += data.toString();
      });

      pythonProcess.on("close", (code: number) => {
        if (code !== 0) {
          logError("Python process failed", new Error(errorData), { filePath });
          reject(new Error(`PDF extraction failed: ${errorData}`));
          return;
        }

        try {
          const result = JSON.parse(outputData);
          if (result.success) {
            resolve(result.text);
          } else {
            reject(
              new Error(result.error || "Unknown error in PDF extraction")
            );
          }
        } catch (error: any) {
          reject(new Error(`Failed to parse Python output: ${error.message}`));
        }
      });
    });
  } catch (error) {
    logError(
      "PDF text extraction failed",
      error instanceof Error ? error : undefined,
      {
        filePath,
      }
    );
    throw new Error(
      `Failed to extract text from PDF file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
