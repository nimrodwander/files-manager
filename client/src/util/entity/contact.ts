export interface ITag{
  id: string,
  name: string,
}

export interface IContact{
  id: string,
  fullName: string,
  email: string,
  phoneNumber: number;
  tags: ITag[];
}