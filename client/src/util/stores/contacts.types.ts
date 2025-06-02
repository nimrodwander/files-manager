import { IContact } from "../entity/contact.entity";

export interface IContactCreateReponse{
  data: IContact;
}

export interface IContactUpdateResponse{
  data: IContact;
}


export interface IContactGetResponse{
  data: IContact[],
}

export interface IContactDeleteResponse{
  data: {readonly id: string}
}