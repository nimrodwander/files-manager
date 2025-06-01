import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source.config';
import { Tag } from '../entity/tag';
import { asyncHandler } from '../middlewares/asyncHandler.middleware';

export class TagsRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get('/', asyncHandler(this.getAllTags));
  }

  private async getAllTags(req: Request, res: Response) {
    const tagRepo = AppDataSource.getRepository(Tag);
    const tags = await tagRepo.find(); // fetch all tags
    res.json({ data: tags });
  }
}

// import express, { Request, Response, Router } from 'express';
// import { AppDataSource } from '../data-source';
// import { Tag } from '../entity/tag';

// const tagsRouter: Router = Router();

// tagsRouter.get('/', async (req: Request, res: Response) => {
//   try {
//     const tagRepo = AppDataSource.getRepository(Tag);
//     const tags = await tagRepo.find(); // fetch all tags
//     res.json({data: tags});
//   } catch (error) {
//     console.error('Error fetching tags:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// export default tagsRouter;