import { ITag } from "./tag.entity";

export interface IContact{
  readonly id: string,
  readonly createdAt: string,   //Used for sorting both UI and Backend\ DB
  fullName: string,
  email: string,
  phoneNumber: string,
  tags: ITag[]
}