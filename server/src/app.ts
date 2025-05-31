import express, { Request, Response, Router } from 'express';
import { AppDataSource } from "./data-source";
import { Contact } from './entity/contact';
import cors from "cors";
import { Tag } from './entity/tag';

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

const app = express();
const port = 5000;

app.use(cors());

app.use(express.json());



app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.get("/contacts", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const contactRepo = AppDataSource.getRepository(Contact);

    const [contacts, total] = await contactRepo.findAndCount({
      skip: offset,
      take: limit,
      relations: ["tags"],
      order: {
        createdAt: "ASC",
      },
    });

    res.json({
      data: contacts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put('/contacts/:id', async (req: Request, res: Response): Promise<any> => {
  const id = req.params.id;
  const { fullName, phoneNumber, email, tags } = req.body;
  const contactRepo = AppDataSource.getRepository(Contact);

  try {
    const contact = await contactRepo.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    contact.fullName = fullName;
    contact.phoneNumber = phoneNumber;
    contact.email = email;

    const tagRepo = AppDataSource.getRepository(Tag);
    // Handle tags (assume tags is an array of tag IDs)
    if (Array.isArray(tags)) {
      contact.tags = await tagRepo.findByIds(tags.map((t: any) => t.id || t));
    }

    await contactRepo.save(contact);

    return res.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/contacts/:id', async (req: Request, res: Response): Promise<any> => {
  const id = req.params.id;
  const contactRepo = AppDataSource.getRepository(Contact);

  try {
    const contact = await contactRepo.findOne({ where: { id } });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await contactRepo.remove(contact);

    return res.status(200).json({ data: {id: id} });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});