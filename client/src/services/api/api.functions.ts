import { LoggerService } from "../errors/errors";

export function CatchHttpError(handler?: (error: any) => void) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        if (handler) {
          handler(error);
        } else {
          console.error(`Error in method "${propertyKey}":`, error);
        }
      }
    };

    return descriptor;
  };
}

export const get = (): void => {
    throw LoggerService.error("Could not get data");
}

export const put = (): void => {
    LoggerService.error("Could not update data");
}

export const post = (): void => {
    throw LoggerService.error("Could not post data");
}

export const remove = (): void => {
    throw LoggerService.error("Could not delete data");
}