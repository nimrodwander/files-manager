import { IContact } from "../entity/contact.entity";

export interface IGetRequest{
  data: IContact[],
  total: number,
  page: number,
  totalPages: number
}