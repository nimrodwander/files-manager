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
    this.router.get('/:id', asyncHandler(this.getStocks.bind(this)));
  }

  private async getStocks(req: Request, res: Response): Promise<void>{
    const response = await this.twelveDataService.getStock('', '', '');
    res.status(response.status).json({data: {message: response.data}});
  }
}