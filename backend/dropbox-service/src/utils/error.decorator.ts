import { logError } from "./logger";

/**
 * Custom error class for Dropbox API related errors
 */
export class DropboxError extends Error {
    constructor(
        message: string,
        public readonly code?: number,
        public readonly details?: unknown
    ) {
        super(message);
        this.name = 'DropboxError';
    }
}

/**
 * Custom error class for network-related errors
 */
export class NetworkError extends Error {
    constructor(
        message: string,
        public readonly originalError?: Error
    ) {
        super(message);
        this.name = 'NetworkError';
        if (originalError?.stack) {
            this.stack = originalError.stack;
        }
    }
}

/**
 * Error decorator for handling method errors with proper logging and error transformation
 * @param options Configuration options for error handling
 * @returns Method decorator
 */
export function handleErrors(options: {
    rethrow?: boolean;
    transformError?: (error: Error) => Error;
} = {}): MethodDecorator {
    return (
        target: Object,
        propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<any>
    ): TypedPropertyDescriptor<any> => {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: unknown[]): Promise<unknown> {
            try {
                return await originalMethod.apply(this, args);
            } catch (error) {
                // Transform fetch/network errors into NetworkError
                if (error instanceof Error && 
                    (error.message.includes('fetch') || error.message.includes('network'))) {
                    error = new NetworkError('Network request failed', error);
                }

                // Transform Dropbox API errors
                if (error instanceof Error && 
                    'status' in error && 
                    typeof (error as any).status === 'number') {
                    error = new DropboxError(
                        error.message,
                        (error as any).status,
                        error
                    );
                }

                // Apply custom error transformation if provided
                if (options.transformError && error instanceof Error) {
                    error = options.transformError(error);
                }

                // Log the error with context
                logError(
                    `Error in ${String(propertyKey)}`,
                    error instanceof Error ? error : new Error('Unknown error'),
                    {
                        className: target.constructor.name,
                        methodName: String(propertyKey),
                        arguments: args
                    }
                );

                // Rethrow by default unless explicitly set to false
                if (options.rethrow !== false) {
                    throw error;
                }
            }
        };

        return descriptor;
    };
}
