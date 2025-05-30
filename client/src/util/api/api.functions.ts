import { Logger } from "../errors";

/**
 * custom decorator for handling errors during fetching
 * replaces try catch repetative logic
*/
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
    Logger.error("Could not get data");
}

export const put = (): void => {
    Logger.error("Could not update data");
}

export const post = (): void => {
    Logger.error("Could not post data");
}

export const remove = (): void => {
    Logger.error("Could not delete data");
}