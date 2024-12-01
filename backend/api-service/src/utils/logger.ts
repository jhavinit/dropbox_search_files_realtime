import winston from "winston";
import { format } from "winston";

const { combine, timestamp, printf, colorize, errors } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack, metadata }) => {
    const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key: string, value: any) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return '[Circular]';
                }
                seen.add(value);
            }
            return value;
        };
    };

    const metadataStr = metadata && Object.keys(metadata).length ? 
        `\nMetadata: ${JSON.stringify(metadata, getCircularReplacer(), 2)}` : '';
    
    return stack ?
        `${timestamp} [${level}]: ${message}\nStack: ${stack}${metadataStr}` :
        `${timestamp} [${level}]: ${message}${metadataStr}`;
});

// Create the logger instance
export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        colorize(),
        logFormat
    ),
    transports: [
        new winston.transports.Console({
            format: combine(
                colorize(),
                logFormat
            )
        })
    ],
    // Handling of uncaught exceptions and unhandled rejections
    exceptionHandlers: [
        new winston.transports.Console({
            format: combine(
                colorize(),
                logFormat
            )
        })
    ],
    rejectionHandlers: [
        new winston.transports.Console({
            format: combine(
                colorize(),
                logFormat
            )
        })
    ]
});

// Add convenience methods for structured logging
export const logInfo = (message: string, metadata?: Record<string, unknown>): void => {
    logger.info(message, { metadata });
};

export const logError = (message: string, error?: Error, metadata?: Record<string, unknown>): void => {
    logger.error(message, {
        metadata,
        stack: error?.stack,
        errorMessage: error?.message
    });
};

export const logWarn = (message: string, metadata?: Record<string, unknown>): void => {
    logger.warn(message, { metadata });
};

export const logDebug = (message: string, metadata?: Record<string, unknown>): void => {
    logger.debug(message, { metadata });
};
