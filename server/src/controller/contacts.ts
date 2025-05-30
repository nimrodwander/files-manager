import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Contact } from "../entity/contact";

export const getContacts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;

  const contactRepo = AppDataSource.getRepository(Contact);

  const [contacts, total] = await contactRepo.findAndCount({
    skip: offset,
    take: limit,
    relations: ["tags"],
    order: {
      fullName: "ASC",
    },
  });

  res.json({
    data: contacts,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
};