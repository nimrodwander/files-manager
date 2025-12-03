import { Request, Response, Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { TwelveDataService } from "../services/twelveData.service";

export class StocksRouter {
  public router: Router;
  private readonly twelveDataService: TwelveDataService = new TwelveDataService();

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get('/', asyncHandler(this.getStocks.bind(this)));
    this.router.get('/:id', asyncHandler(this.getStock.bind(this)));
  }

  private async getStocks(req: Request, res: Response): Promise<void> {
    const idsParam = req.query.ids as string;
    const start = req.query.start as string;
    const end = req.query.end as string;

    if (!idsParam) {
      res.status(400).json({error: "Parameter ids is missing"});
      return;
    }

    const ids = idsParam.split(',');
    const response = await this.twelveDataService.getStocks(ids, start, end);
    const raw = response.data;

    const transformed = Object.entries(raw).flatMap(([symbol, stockData]: any) => {
      if (!stockData.values) {
        return [];
      }

      if (!Array.isArray(stockData.values)) {
        return [];
      }

      return stockData.values.map((v: any) => ({
        id: symbol,
        datetime: v.datetime,
        close: v.close
      }));
    });

    res.status(200).json({ data: transformed });
  }

  private async getStock(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const start = req.query.start as string;
    const end = req.query.end as string;

    if (!id) {
      res.status(400).json({ error: "Parameter id is missing" });
      return;
    }

    const response = await this.twelveDataService.getStock(id, start, end);
    const raw = response.data;

    const transformed = (raw.values && Array.isArray(raw.values) ? raw.values : []).map((v: any) => ({
      id,
      datetime: v.datetime,
      close: v.close
    }));

    res.status(200).json({ data: transformed });
  }
}