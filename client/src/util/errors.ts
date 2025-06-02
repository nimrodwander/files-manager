export class Logger{
    public static IIFEerror(message: string, error?: unknown): never{
        console.error(error);
        return (() => { throw new Error("ERROR: " + message); })();
    }

    public static error(message: string, error?: unknown): Error{
        return new Error("ERROR: " + message);
    }
}