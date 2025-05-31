import { IContact } from "../../util/entity/contact.entity";

export type IContactForm = Omit<IContact, 'tags'> & {
  tags: Map<string, string>;
};