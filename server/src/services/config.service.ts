export class ConfigService{
    public static port: number = 5000; //Number(process.env.PORT) || 5000;
    public static twelveDataApiKey: string = 'b8a8f82c5f33440ea71aa9c4451b4c4c';//String(process.env.TWELVE_DATA_API_KEY);
    public static twelveDataUrl: string = 'https://api.twelvedata.com';//String(process.env.TWELVE_DATA_URL);
}