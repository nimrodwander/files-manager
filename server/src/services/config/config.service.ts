export class ConfigService{
    public static port: number = Number(process.env.PORT) || 5000;
}