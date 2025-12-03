export interface StockCloseData {
    id: string;
    datetime: string;
    close: string;
}

export interface StocksCloseResponse {
    data: StockCloseData[];
}