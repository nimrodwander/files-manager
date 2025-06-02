import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source.config';
import { Tag } from '../entity/tag.entity';
import { asyncHandler } from '../middlewares/asyncHandler.middleware';
import { Repository } from 'typeorm';

export class TagsRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initRoutes()
  }

  //Init all the routes with async handler middleware
  private _initRoutes(): void {
    this.router.get('/', asyncHandler(this._getAllTags));
  }

  /**
   * Gets all the tags
   */
  private async _getAllTags(req: Request, res: Response): Promise<void> {
    
    const tagRepo: Repository<Tag> = AppDataSource.getRepository(Tag)
    const tags: Tag[] = await tagRepo.find();
    
    res.json({ data: tags })
  }
}