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

  public async start(port: number) {
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

  private _initMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json())
  }

  private _initRoutes() {
    this.app.use('/api/contacts', this._contactsRouter.router);
    this.app.use('/api/tags', this._tagsRouter.router);
  }

  private _initErrorHandling() {
    this.app.use(errorHandler)
  }
}