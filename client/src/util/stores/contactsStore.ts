import { action, makeAutoObservable, makeObservable, observable } from "mobx";
import { IContact } from "../entity/contact";
import { Api } from "../api/api";

export class ContactsStore{
  private _data: Map<string, IContact> = new Map<string, IContact>();
  private _path = {contacts: "/contacts"}
  private _api = new Api();

  constructor() {
    makeAutoObservable(this);
  }

  private _configObservability(){
    
  }

  public async init(){
  const data: IContact[] = await this._api.get<IContact[]>(this._path.contacts);    
  /*const data: IContact[] = Array.from({ length: 100 }, (_, i) => {
    return {
        id: i.toString(),
        fullName: 'fef',
        email: 'fef',
        phoneNumber: 65965,
        tags: [{id: '32', name: 'fwf'}]
    }
  })*/

    for(let i = 0; i < data.length; i++){
      this._data.set(data[i].id, data[i]);
    }
  }

  public get data(): IContact[]{
    return Array.from(this._data.values());
  }
}

export const contactsStore = new ContactsStore();