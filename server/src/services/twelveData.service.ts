import axios from "axios";
import { ConfigService } from "./config.service";

export class TwelveDataService{
    public async getStocks(ids: string[], start: string, end: string) {
        const symbolParam = ids.join(',');
        const url = `${ConfigService.twelveDataUrl}/time_series?symbol=${symbolParam}&interval=1day&start_date=${start}&end_date=${end}&apikey=${ConfigService.twelveDataApiKey}`;
        return await axios.get(url);
    }
}