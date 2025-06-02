import { AppDataSource } from "../config/data-source.config";
import { Request, Response, Router } from "express";
import { Contact } from "../entity/contact.entity";
import { Tag } from "../entity/tag.entity";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";

export class ContactsRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initRoutes();
  }

  private _initRoutes() {
    this.router.get('/', asyncHandler(this._getContacts));
    this.router.post('/', asyncHandler(this._createContact));
    this.router.put('/:id', asyncHandler(this._updateContact));
    this.router.delete('/:id', asyncHandler(this._deleteContact));
  }

  private async _getContacts(req: Request, res: Response) {
    const skip = parseInt(req.query.skip as string) || 0;
    const limit = parseInt(req.query.limit as string) || 20
    
    const contactRepo = AppDataSource.getRepository(Contact);

    const [contacts, total] = await contactRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: skip,
      take: limit,
      relations: ['tags'],
    });

    res.json({data: contacts});
  }

  private async _createContact(req: Request, res: Response) {
    const { id, createdAt, tags = [], ...rest } = req.body;

    console.log(req.body);

    const tagRepo = AppDataSource.getRepository(Tag)
    const contactRepo = AppDataSource.getRepository(Contact);

    const tagEntities = await tagRepo.findByIds(tags.map((t: any) => t.id || t));


    const contact = contactRepo.create({
      ...rest,
      tags: tagEntities,
    });

    const saved = await contactRepo.save(contact)

    res.status(201).json({ data: saved });
  }

  private async _updateContact(req: Request, res: Response) {
    
    const id = req.params.id;
    
    const contactRepo = AppDataSource.getRepository(Contact);
    const contact = await contactRepo.findOne({ where: { id }, relations: ['tags'] });


    if (!contact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    Object.assign(contact, req.body)
    await contactRepo.save(contact)
    res.json({ data: contact });
  }

  private async _deleteContact(req: Request, res: Response) {
    const id = req.params.id;
    
    const contactRepo = AppDataSource.getRepository(Contact);
    const contact = await contactRepo.findOne({ where: { id } })

    if (!contact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    await contactRepo.remove(contact)

    res.status(200).json({ data: { id } })
  }
}