import { ITag } from "./tag.entity";

export interface IContact{
  readonly id: string,
  readonly createdAt: string,
  fullName: string,
  email: string,
  phoneNumber: string,
  tags: ITag[]
}