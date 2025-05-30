import express, { Request, Response } from 'express';
import { AppDataSource } from "./data-source";
import { Contact } from './entity/contact';
import cors from "cors";

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});