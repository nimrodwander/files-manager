import axios from "axios";
import { ConfigService } from "./config.service";
import { StocksResponse } from "../models/models";

export class TwelveDataService{
    public async getStocks(ids: string[], start: string, end: string): Promise<StocksResponse> {
        const symbolParam = ids.join(',');
        const url = `${ConfigService.twelveDataUrl}/time_series?symbol=${symbolParam}&interval=1day&start_date=${start}&end_date=${end}&apikey=${ConfigService.twelveDataApiKey}`;
        return await axios.get(url);
    }

    public async getStock(id: string, start: string, end: string): Promise<StocksResponse> {
        const url = `${ConfigService.twelveDataUrl}/time_series?symbol=${id}&interval=1day&start_date=${start}&end_date=${end}&apikey=${ConfigService.twelveDataApiKey}`;
        return await axios.get(url);
    }
}