import { IContact } from "../entity/contact.entity";

export interface IContactUpdateRequest{
  data: IContact;
}

export interface IContactGetResponse{
  data: IContact[],
  total: number,
  page: number,
  totalPages: number
}

export interface IContactDeleteResponse{
  data: {readonly id: string}
}