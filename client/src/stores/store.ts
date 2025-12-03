import { makeAutoObservable } from "mobx";
import { StockCloseData, StocksCloseResponse } from "../models/models";
import { apiService } from "../services/api/api.service";
import { DateTime } from 'luxon';

export class Store{
  public stocks: Map<string, StockCloseData> = new Map<string, StockCloseData>();
  public endDate: string = DateTime.now().toISODate();
  public startDate: string = DateTime.now().minus({ months: 36 }).toISODate();
  private readonly defaultStockName: string = 'SPY';

  constructor() {
      makeAutoObservable(this);
  }


  public async init(): Promise<void>{
    console.log(this.startDate);
    const response: StocksCloseResponse = await apiService.get<StocksCloseResponse>(`/stocks?ids=${this.defaultStockName}&start=${this.startDate}&end=${this.endDate}`);
    this.setItems(response.data);
  }

  private setItems(data: StockCloseData[]){
    data.forEach((item: StockCloseData) => {
      this.stocks.set(item.datetime, item);
    });
  }
  
}

export const store: Store = new Store();