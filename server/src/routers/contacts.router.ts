import { AppDataSource } from "../config/data-source.config";
import { Request, Response, Router } from "express";
import { Contact } from "../entity/contact";
import { Tag } from "../entity/tag";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";

export class ContactsRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get('/', asyncHandler(this.getAllContacts));
    this.router.post('/', asyncHandler(this.createContact));
    this.router.put('/:id', asyncHandler(this.updateContact));
    this.router.delete('/:id', asyncHandler(this.deleteContact));
  }

  private async getAllContacts(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const contactRepo = AppDataSource.getRepository(Contact);

    const [contacts, total] = await contactRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
      relations: ['tags'],
    });

    res.json({
      data: contacts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  }

  private async createContact(req: Request, res: Response) {
    const { id, createdAt, tags = [], ...rest } = req.body;

    console.log(req.body);

    const tagRepo = AppDataSource.getRepository(Tag);
    const contactRepo = AppDataSource.getRepository(Contact);

    const tagEntities = await tagRepo.findByIds(tags.map((t: any) => t.id || t));

    const contact = contactRepo.create({
      ...rest,
      tags: tagEntities,
    });

    const saved = await contactRepo.save(contact);

    res.status(201).json({ data: saved });
  }

  private async updateContact(req: Request, res: Response) {
    const id = req.params.id;
    const contactRepo = AppDataSource.getRepository(Contact);
    const contact = await contactRepo.findOne({ where: { id }, relations: ['tags'] });

    if (!contact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    Object.assign(contact, req.body);
    await contactRepo.save(contact);
    res.json({ data: contact });
  }

  private async deleteContact(req: Request, res: Response) {
    const id = req.params.id;
    const contactRepo = AppDataSource.getRepository(Contact);
    const contact = await contactRepo.findOne({ where: { id } });

    if (!contact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    await contactRepo.remove(contact);
    res.status(200).json({ data: { id } });
  }
}

// import { AppDataSource } from "../data-source";
// import { Request, Response, Router } from 'express';
// import { Contact } from "../entity/contact";
// import { Tag } from "../entity/tag";

// const contactsRouter: Router = Router();

// contactsRouter.get("/", async (req: Request, res: Response) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 20;
//     const offset = (page - 1) * limit;

//     const contactRepo = AppDataSource.getRepository(Contact);

//     const [contacts, total] = await contactRepo.findAndCount({
//        order: { createdAt: 'DESC' },
//       skip: offset,
//       take: limit,
//       relations: ["tags"],
//     });

//     res.json({
//       data: contacts,
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//     });
//   } catch (err) {
//     console.error("Error fetching contacts:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// contactsRouter.put('/:id', async (req: Request, res: Response): Promise<any> => {
//   const id = req.params.id;
//   const { fullName, phoneNumber, email, tags } = req.body;
//   console.log(req.body);
//   const contactRepo = AppDataSource.getRepository(Contact);

//   try {
//     const contact = await contactRepo.findOne({
//       where: { id },
//       relations: ['tags'],
//     });

//     if (!contact) {
//       return res.status(404).json({ message: 'Contact not found' });
//     }

//     contact.fullName = fullName;
//     contact.phoneNumber = phoneNumber;
//     contact.email = email;

//     const tagRepo = AppDataSource.getRepository(Tag);
//     // Handle tags (assume tags is an array of tag IDs)
//     if (Array.isArray(tags)) {
//       contact.tags = await tagRepo.findByIds(tags.map((t: any) => t.id || t));
//     }

//     await contactRepo.save(contact);

//     return res.json({data: contact});
//   } catch (error) {
//     console.error('Error updating contact:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });

// contactsRouter.delete('/:id', async (req: Request, res: Response): Promise<any> => {
//   const id = req.params.id;
//   const contactRepo = AppDataSource.getRepository(Contact);

//   try {
//     const contact = await contactRepo.findOne({ where: { id } });

//     if (!contact) {
//       return res.status(404).json({ message: 'Contact not found' });
//     }

//     await contactRepo.remove(contact);

//     return res.status(200).json({ data: {id: id} });
//   } catch (error) {
//     console.error('Error deleting contact:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });

// contactsRouter.post('/', async (req: Request, res: Response) => {
//   try {
//     const {id, createdAt, ...data} = req.body;
     
//     const contactRepository = AppDataSource.getRepository(Contact);

//     const contact = contactRepository.create(data);

//     const savedContact = await contactRepository.save(contact);

//     res.status(201).json({ data: savedContact });
//   } catch (error) {
//     console.error('Failed to create contact:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// export default contactsRouter;