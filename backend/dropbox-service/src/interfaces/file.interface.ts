/**
 * @fileoverview Interface definitions for file operations
 * Contains types used for file handling and storage
 */

/**
 * Represents a file in the system with its metadata
 */
export interface IFileMetadata {
  /** Name of the file */
  filename: string;
  /** URL of the file */
  url: string;
  /** Text content of the file */
  text: string;
  createdAt?: Date;
}
