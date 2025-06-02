import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source.config';
import { Tag } from '../entity/tag.entity';
import { asyncHandler } from '../middlewares/asyncHandler.middleware';

export class TagsRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initRoutes()
  }

  private _initRoutes() {
    this.router.get('/', asyncHandler(this._getAllTags));
  }

  private async _getAllTags(req: Request, res: Response) {
    
    const tagRepo = AppDataSource.getRepository(Tag)
    const tags = await tagRepo.find();
    
    res.json({ data: tags })
  }
}