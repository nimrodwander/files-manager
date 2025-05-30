export class Logger{
    public static error(message: string, error?: unknown){
        console.error(error);
        return (() => { throw new Error("ERROR: " + message); })();
    }
}