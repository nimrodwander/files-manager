import { IContact } from "../../util/entity/contact.entity";
import { ITag } from "../../util/entity/tag.entity";
import { IContactForm } from "./contactForm.types";

/*export class ContactFormConverter{
  public toForm(entityValues: IContact | undefined): IContactForm{
    if(entityValues === undefined){
        entityValues = this._fallbackValuesInit();
    }

    const {tags, ...rest} = entityValues;
    const tagsMap: Map<string, string> = new Map<string, string>();
    tags.forEach((tag: ITag) => tagsMap.set(tag.id, tag.name));
    return{
      ...rest,
      tags: tagsMap
    }
  }

  public fromForm(formValues: IContactForm): IContact{
    const {tags, ...rest} = formValues;
    let tagsArray: ITag[] = [];
    tags.forEach((key: string, value: string) => tagsArray.push({id: key, name: value}))

    return{
        ...rest,
        tags: tagsArray
    }
  }

  private _fallbackValuesInit(): IContact {
        const newContact: IContact = {
          id: '',
          fullName: '',
          email: '',
          phoneNumber: -1,
          tags: []
        }
        return newContact;
    }
}*/