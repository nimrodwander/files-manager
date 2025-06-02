import { makeAutoObservable, runInAction } from "mobx";
import { IContact } from "../entity/contact.entity";
import { ApiService } from "../api/api.service";
import { IPaginationStore, IStore } from "./abstract.store";
import { IContactCreateReponse, IContactDeleteResponse, IContactGetResponse, IContactUpdateResponse } from "./contacts.types";
import { Logger } from "../errors";

export class ContactsStore implements IStore, IPaginationStore{
  private readonly _api: ApiService = new ApiService();
  private readonly _limit: number = 20;
  private _contacts: Map<string, IContact> = new Map<string, IContact>();
  private _newContacts: Map<string, IContact> = new Map<string, IContact>();
  private _hasMorePages: boolean = true;
  private _isLoading: boolean = false;
  private _buffer: Map<string, IContact> = new Map<string, IContact>();

  constructor() {
    makeAutoObservable(this);
  }

  public async createOne(payload: IContact): Promise<void>{
    this._isLoading = true;
    const response = await this._api.post<IContact, IContactCreateReponse>('/contacts', payload);
    const contact = response.data;

    runInAction((): void => {
      this._newContacts = this._newContacts.set(contact.id, contact);
      this._isLoading = false;
    });
  }

  
  public getOne(id: string): IContact{
    const contact: undefined | IContact = this._contacts.get(id) || this._newContacts.get(id);
    
    if(contact === undefined){
      throw Logger.error("Could not find contact");
    }

    return contact;
  }

  public async updateOne(id: string, payload: IContact): Promise<void>{
    this._isLoading = true;
    const result: IContactUpdateResponse = await this._api.put<IContact, IContactUpdateResponse>(`/contacts/${id}`, payload);
    const contact: IContact = result.data; 
    
    runInAction((): void => {
      if(this._contacts.has(contact.id)){
        this._contacts = this._contacts.set(contact.id, contact);
      }
      else if(this._newContacts.has(contact.id)){
        this._newContacts = this._newContacts.set(contact.id, contact);
      }
      this._isLoading = false;
    });
  }

  public async deleteOne(id: string): Promise<void>{
    this._isLoading = true;
    const result: IContactDeleteResponse = await this._api.delete<IContactDeleteResponse>(`/contacts/${id}`);

    runInAction((): void => {
      if(this._contacts.has(result.data.id)){
        this._contacts.delete(result.data.id);
      }
      else if(this._newContacts.has(result.data.id)){
        this._newContacts.delete(result.data.id);
      }
      this._isLoading = false;
    });
  }

  public get sizeWithBuffer(){
    return this._contacts.size + this._newContacts.size + this._buffer.size;
  }

  public async loadNext(): Promise<void> {

    //Allows to load only one chuck of contacts at once
    if (this._isLoading || !this._hasMorePages){
      return;
    }
    
    this._isLoading = true;
    const result: IContactGetResponse = await this._api.get<IContactGetResponse>(`/contacts/?skip=${this.sizeWithBuffer}&limit=${this._limit}`);
    const contacts: IContact[] = result.data;
    
    runInAction((): void => {
      //Moving contacts from buffer into the contacts list
      //and then removing all the content from buffer
      this._buffer.forEach((value: IContact, key: string) => this._contacts.set(key,value));
      this._buffer.clear();
      contacts.forEach((contact: IContact) => this._buffer.set(contact.id, contact));

      this._hasMorePages = contacts.length === this._limit;
      this._isLoading = false;
    });
  }

  public async init(): Promise<void>{
    const result: IContactGetResponse = await this._api.get<IContactGetResponse>(`/contacts?limit=${40}`);
    const contacts: IContact[] = result.data;
    
    runInAction((): void => {
      //Hypothetical reset if there was other pages in the app data might be stale
      this._contacts.clear();
      this._buffer.clear();

      contacts.forEach((item: IContact, index: number, array: IContact[]) => {
        if(index < Math.floor(array.length/2)){
          this._contacts.set(item.id, item)
        }
        else{
          this._buffer.set(item.id, item);
        }
      });
    });
  }

  public get hasMorePages(): boolean {
    return this._hasMorePages;
  }

  public get isloading(): boolean{
    return this._isLoading;
  }

  //For a user it matters to view the new contacts he added but since there are much more it should not care about all the others
  //Placing the new contacts at the top of the list in sorted order
  //and the other contacts in previous sessions under
  public get contactsIds(): string[]{
    const newContacts = Array.from(this._newContacts.values())
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((item) => item.id);

    const oldContacts = Array.from(this._contacts.keys());

    return newContacts.concat(oldContacts);
  }
}

export const contactsStore = new ContactsStore();