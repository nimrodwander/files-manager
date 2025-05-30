export class Logger{
    throwIIFEError(message: string, error?: unknown){
        console.error(error);
        return (() => { throw new Error("ERROR: " + message); })();
    }
}

export const logger = new Logger();