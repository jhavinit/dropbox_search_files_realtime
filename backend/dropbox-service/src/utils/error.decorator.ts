import { logger } from "./logger";

export function handleErrors(): MethodDecorator {
    return (
        target: Object,
        propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<any>
    ): void => {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            try {
                return await originalMethod.apply(this, args);
            } catch (error) {
                logger.error(`Error in ${String(propertyKey)}:`, error);
                // throw error;
            }
        };
    };
}
