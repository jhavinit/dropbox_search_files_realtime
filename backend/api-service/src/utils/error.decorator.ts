import { logError } from "./logger";

/**
 * Custom error class for Elasticsearch API related errors
 */
export class ElasticsearchError extends Error {
  constructor(
    message: string,
    public readonly code?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ElasticsearchError";
  }
}

/**
 * Custom error class for network-related errors
 */
export class NetworkError extends Error {
  constructor(message: string, public readonly originalError?: Error) {
    super(message);
    this.name = "NetworkError";
    if (originalError?.stack) {
      this.stack = originalError.stack;
    }
  }
}

interface IErrorHandlerOptions {
  transformError?: (error: unknown) => Error;
}

/**
 * Error decorator for handling method errors with proper logging and error transformation
 * @param options Configuration options for error handling
 * @returns Method decorator
 */
export function handleErrors(
  options: IErrorHandlerOptions = {}
): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (this: any, ...args: unknown[]): Promise<unknown> {
      try {
        return await originalMethod.apply(this, args);
      } catch (error: unknown) {
        const transformedError = options.transformError
          ? options.transformError(error)
          : error instanceof Error
          ? error
          : new Error(String(error));

        // Filter out request and response objects from args to avoid circular references
        const sanitizedArgs = args.map(arg => {
          if (arg && typeof arg === 'object' && ('method' in arg || 'socket' in arg)) {
            return '[Request/Response Object]';
          }
          return arg;
        });

        logError("Operation failed", transformedError, {
          method: propertyKey.toString(),
          args: sanitizedArgs,
        });

        throw transformedError;
      }
    };

    return descriptor;
  };
}
