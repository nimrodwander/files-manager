export class LoggerService{
    public static IIFEerror(message: string, error?: unknown){
        console.error(error);
        return (() => { throw new Error("ERROR: " + message); })();
    }

    public static error(message: string, error?: unknown): Error{
        return new Error("ERROR: " + message);
    }
}