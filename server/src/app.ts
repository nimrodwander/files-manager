import cors from "cors";
import express, { Application } from 'express';
import 'reflect-metadata';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { XRouter } from "./routers/router";

export class App {
  public app: Application;
  private router = new XRouter();

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
    this.app.use('/api/router', this.router.router);
  }

  private initErrorHandling(): void {
    this.app.use(errorHandler)
  }
}