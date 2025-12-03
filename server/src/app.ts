import cors from "cors";
import express, { Application } from 'express';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { StocksRouter } from "./routers/stocks.router";

export class App {
  public app: Application;
  private stocksRouter = new StocksRouter();

  constructor() { 
    this.app = express();
    this.initMiddlewares();
    this.initRouters();
    this.initErrorHandling();
  }

  public async start(port: number): Promise<void> {
    try {
      this.app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
      });
    }
    catch (error) {
      console.error('Error during Data Source initialization', error)
    }
  }

  private initMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json())
  }

  private initRouters(): void {
    this.app.use('/api/stocks', this.stocksRouter.router);
  }

  private initErrorHandling(): void {
    this.app.use(errorHandler)
  }
}