import { AppDataSource } from "../config/data-source.config";
import { Request, Response, Router } from "express";
import { Contact } from "../entity/contact.entity";
import { Tag } from "../entity/tag.entity";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { Repository } from "typeorm";

export class ContactsRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initRoutes();
  }

  //Init all the routes with async handler middleware
  private _initRoutes(): void {
    this.router.get('/', asyncHandler(this._getContacts));
    this.router.post('/', asyncHandler(this._createContact));
    this.router.put('/:id', asyncHandler(this._updateContact));
    
    this.router.delete('/:id', asyncHandler(this._deleteContact));
  }

  private async _getContacts(req: Request, res: Response): Promise<void> {
    
    //Number of items to skip
    const skip: number = parseInt(req.query.skip as string) || 0;
    
    //The size of the chunk 
    const limit: number = parseInt(req.query.limit as string) || 20
    
    const contactRepo: Repository<Contact> = AppDataSource.getRepository(Contact);

    /**
     * The whole list is sorted by the DB index createdAt
     * The idea is to keep the frontend in sync with the backend at every givven moment
     * such that the frontend will represent partial list of the backend in a sorted way by the createdAt property
     */
    const [contacts, total] = await contactRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: skip,
      take: limit,
      relations: ['tags'],
    });

    res.json({data: contacts});
  }

  /**
   * Creating a new contact
   */
  private async _createContact(req: Request, res: Response): Promise<void> {
    const { id, createdAt, tags = [], ...rest } = req.body;

    const tagRepo: Repository<Tag> = AppDataSource.getRepository(Tag)
    const contactRepo: Repository<Contact> = AppDataSource.getRepository(Contact);

    const tagEntities: Tag[] = await tagRepo.findByIds(tags.map((t: any) => t.id || t));


    const contact: Contact[] = contactRepo.create({
      ...rest,
      tags: tagEntities,
    });

    const saved: Contact[] = await contactRepo.save(contact)

    res.status(201).json({ data: saved });
  }

  /**
   * Updating an existing contact
   */
  private async _updateContact(req: Request, res: Response): Promise<void> {
    
    const id: string = req.params.id;
    
    const contactRepo: Repository<Contact> = AppDataSource.getRepository(Contact);
    const contact: Contact | null = await contactRepo.findOne({ where: { id }, relations: ['tags'] });


    if (!contact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    Object.assign(contact, req.body)
    await contactRepo.save(contact)
    res.json({ data: contact });
  }

  /**
   * Deleting a contact
   */
  private async _deleteContact(req: Request, res: Response): Promise<void> {
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