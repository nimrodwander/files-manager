import { LoggerService } from "../errors/errors";

export class ConfigService{
    public static API_URL = process.env.REACT_APP_API_URL || LoggerService.IIFEerror("Missing REACT_APP_API_URL");
}
