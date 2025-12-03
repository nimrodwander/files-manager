import axios from "axios"
import { ConfigService } from "./config.service";

export class TwelveDataService{
    public async getStock(id: string, start: string, end: string){
        const url = `${ConfigService.twelveDataUrl}/time_series?symbol=SPY&interval=1day&start_date=2025-01-01&end_date=2025-12-01&apikey=${ConfigService.twelveDataApiKey}`
        return await axios.get(url);
    }
}