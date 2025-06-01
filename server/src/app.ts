import 'reflect-metadata';
import express, { Application } from 'express';
import { DataSource } from 'typeorm';
import { Contact } from './entity/contact';
import { Tag } from './entity/tag';
import { ContactsRouter } from './routers/contacts.router';
import { TagsRouter } from './routers/tags.router';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { AppDataSource } from './config/data-source.config';
import cors from "cors";

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  public async start(port: number) {
    try {
      await AppDataSource.initialize();
      console.log('Database connected');
      this.app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
      });
    } 
    catch (error) {
      console.error('Error during Data Source initialization', error);
    }
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeRoutes() {
    this.app.use('/contacts', new ContactsRouter().router);
    this.app.use('/tags', new TagsRouter().router);
  }

  private initializeErrorHandling() {
    this.app.use(errorHandler);
  }
}