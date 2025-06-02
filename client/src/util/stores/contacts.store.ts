import { makeAutoObservable, runInAction } from "mobx";
import { IContact } from "../entity/contact.entity";
import { ApiService } from "../api/api.service";
import { IInfiniteScrollStore, IStore } from "./abstract.store";
import { IContactCreateReponse, IContactDeleteResponse, IContactGetResponse, IContactUpdateResponse } from "./contacts.types";
import { Logger } from "../errors";

/**
 * The main store
 */

export class ContactsStore implements IStore, IInfiniteScrollStore{
  private readonly _api: ApiService = new ApiService();
  
  /**
   * Map object representing the contatacts in the db prior to the current seesion
   * The idea of using a map is to speed up reading time for faster rendering
   * intead of iterating over an array in O(n) we retreive an item at O(1)
   */
  private _contacts: Map<string, IContact> = new Map<string, IContact>();

  /**
   * Contacts added by the user in current session
   * The intuition is that when ever a user creates a new item it should appear at the top of the list
   * because it is the newest item, but map object does not guarantee a specific order.
   * Therefore we would like to create a new list wich will appeared above of the contacts list\ map
   */
  private _newContacts: Map<string, IContact> = new Map<string, IContact>();

  /**
   * Defines if an api call is active or not.
   * Using this variable in methods allows to throttle unnecessary calls
   * All the async methods write to this variable in order to establish a standard of api state
   */
  private _isLoading: boolean = false;

  /**
   * Standard buffer in order to improve user expirience in slow networks
   * Whenever a user loads the next chunk of contacts the buffer passes its content to the the contacts Map
   * and the buffer is gets populated in the background without the user noticing.
   * Such that intead of wating +200ms for HTTP request we get a much faster operation
   */
  private _buffer: Map<string, IContact> = new Map<string, IContact>();

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Note that when creating a new contact insert it into the newContacts list rather than contacts list
   */
  public async createOne(payload: IContact): Promise<void>{
    this._isLoading = true;
    const response = await this._api.post<IContact, IContactCreateReponse>('/contacts', payload);
    const contact = response.data;

    runInAction((): void => {
      //inseting into the newContacts list
      this._newContacts = this._newContacts.set(contact.id, contact);
      this._isLoading = false;
    });
  }

  public getOne(id: string): IContact{
    //A contact item might be either in contacts or newContacts
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
      
      //A contact item might be either in contacts or newContacts
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
      //A contact item might be either in contacts or newContacts
      if(this._contacts.has(result.data.id)){
        this._contacts.delete(result.data.id);
      }
      else if(this._newContacts.has(result.data.id)){
        this._newContacts.delete(result.data.id);
      }
      this._isLoading = false;
    });
  }

 
  /**
   * Loads the next chunk of contacts defaults to 20
   * Steps:
   * 1. Pass all the buffer items to the conctacts Map
   * 2. Remove all the content from buffer
   * 3. Load the next chunk
   * 4. Insert the next chunk into the buffer
   * 
   * Note: Step 4 allows the user to continue interact freely with the app while the next chunk gets loaded in the background ready for the next iteration
   */
  public async loadNext(limit: number = 20): Promise<void> {

    //Allows to load only one chuck of contacts at once
    if (this._isLoading){
      return;
    }
    
    this._isLoading = true;

    this._buffer.forEach((value: IContact, key: string) => this._contacts.set(key,value));
    this._buffer.clear();

    const result: IContactGetResponse = await this._api.get<IContactGetResponse>(`/contacts/?skip=${this._sizeWithBuffer}&limit=${limit}`);
    const contacts: IContact[] = result.data;
    
    runInAction((): void => {
      //Moving contacts from buffer into the contacts list
      //and then removing all the content from buffer
      contacts.forEach((contact: IContact) => this._buffer.set(contact.id, contact));

      this._isLoading = false;
    });
  }

  /**
   * Initiallize the store
   * Loads 40 items the first 20 goes to the contacts and the other 20 go to the buffer
   */
  public async init(limit: number = 40): Promise<void>{
    const result: IContactGetResponse = await this._api.get<IContactGetResponse>(`/contacts?limit=${limit}`);
    const contacts: IContact[] = result.data;
    
    runInAction((): void => {
      //Hypothetical reset if there was other pages in the app data might be stale
      this._contacts.clear();
      this._buffer.clear();

      //Loads 40 items the first 20 goes to the contacts and the other 20 go to the buffer
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

  /**
   * Calculate the size of the items in stores
   * This tells the backend/db how many items to skip
  */
  private get _sizeWithBuffer(): number{
    return this._contacts.size + this._newContacts.size + this._buffer.size;
  }

  
  /**
   * For a user it matters to view the new contacts he added but since there are much more it should not care about all the others
   * Placing the new contacts at the top of the list in sorted order
   * and the other contacts in previous sessions under
   */
  public get contactsIds(): string[]{

    //Sorts the contacts by the createdAt property in order to ensure 
    //that the user sees the latest item it created at the top of the list
    const newContacts = Array.from(this._newContacts.values())
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((item) => item.id);
    
    const oldContacts = Array.from(this._contacts.keys());
    
    //Placing the newContacts object above the contacts object
    return newContacts.concat(oldContacts);
  }

  public get isloading(): boolean{
    return this._isLoading;
  }
}

export const contactsStore: ContactsStore = new ContactsStore();