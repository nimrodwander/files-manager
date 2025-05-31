import { IContact } from "../entity/contact.entity";

export interface IGetRequest{
  data: IContact[],
  total: number,
  page: number,
  totalPages: number
}

export interface IUpdateRequest{
  data: IContact;
}

export interface IDeleteRequest{
  data: {readonly id: string}
}