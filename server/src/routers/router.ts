import { Request, Response, Router } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../config/db.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { Contact } from "../models/models";

export class XRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.delete('/:id', asyncHandler(this.deleteContact));
  }

  private async deleteContact(req: Request, res: Response): Promise<void> {
    const id: string = req.params.id;
    
    const contactRepo: Repository<Contact> = AppDataSource.getRepository(Contact);
    const contact: Contact | null = await contactRepo.findOne({ where: { id } })

    if (!contact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    await contactRepo.remove(contact)

    res.status(200).json({ data: { id } })
  }
}