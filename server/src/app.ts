import 'reflect-metadata';
import express, { Application } from 'express';
import { DataSource } from 'typeorm';
import { Contact } from './entity/contact.entity';
import { Tag } from './entity/tag.entity';
import { ContactsRouter } from './routers/contacts.router';
import { TagsRouter } from './routers/tags.router';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { AppDataSource } from './config/data-source.config';
import cors from "cors";

export class App {
  public app: Application;
  private _contactsRouter = new ContactsRouter();
  private _tagsRouter = new TagsRouter();

  constructor() {
    this.app = express();
    this._initMiddlewares();
    this._initRoutes();
    this._initErrorHandling();
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

  private _initMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json())
  }

  private _initRoutes(): void {
    this.app.use('/api/contacts', this._contactsRouter.router);
    this.app.use('/api/tags', this._tagsRouter.router);
  }

  private _initErrorHandling(): void {
    this.app.use(errorHandler)
  }
}