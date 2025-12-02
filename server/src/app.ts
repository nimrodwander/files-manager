import cors from "cors";
import express, { Application } from 'express';
import 'reflect-metadata';
import { AppDataSource } from './config/db.config';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { XRouter } from "./routers/router";

export class App {
  public app: Application;
  private contactsRouter = new XRouter();

  constructor() {
    this.app = express();
    this.initMiddlewares();
    this.initRouters();
    this.initErrorHandling();
  }

  public async start(port: number): Promise<void> {
    try {
      await AppDataSource.initialize()
      console.log('Database connected')
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
    this.app.use('/api/contacts', this.contactsRouter.router);
  }

  private initErrorHandling(): void {
    this.app.use(errorHandler)
  }
}