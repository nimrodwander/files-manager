import { ITag } from "./tag.entity";

export interface IContact{
  id: string,
  fullName: string,
  email: string,
  phoneNumber: number,
  tags: ITag[]
}