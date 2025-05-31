import { makeAutoObservable, runInAction } from "mobx";
import { IContact } from "../entity/contact.entity";
import { ApiService } from "../api/api.service";
import { IPaginationStore } from "./abstract.store";
import { IDeleteRequest, IGetRequest, IUpdateRequest } from "./contacts.store.types";
import { Logger } from "../errors";

export class ContactsStore implements IPaginationStore{
  private readonly _api: ApiService = new ApiService();
  private readonly _limit: number = 20;
  private _contacts: Map<string, IContact> = new Map<string, IContact>();
  private _currentPage: number = 1;
  private _hasMorePages: boolean = true;
  private _isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  private _nextPage(): void{
      this._currentPage = this._currentPage + 1;
  }

  public async createOne(payload: IContact): Promise<void>{

  }

  
  public getOne(id: string): IContact{
    const contact: undefined | IContact = this._contacts.get(id);
    
    if(contact === undefined){
      throw Logger.error("Could not find contact");
    }

    return contact;
  }

  public async updateOne(id: string, payload: IContact): Promise<void>{
    this._isLoading = true;
    const result: IUpdateRequest = await this._api.post<IContact, IUpdateRequest>(`/contacts/${id}`, payload);
    const contact: IContact = result.data; 
    
    runInAction((): void => {
      this._contacts = this._contacts.set(contact.id, contact);
      this._isLoading = false;
    });
  }

  public async deleteOne(id: string): Promise<void>{
    this._isLoading = true;
    const result: IDeleteRequest = await this._api.delete<IDeleteRequest>(`/contacts/${id}`);

    runInAction((): void => {
      this._contacts.delete(result.data.id);
      this._isLoading = false;
    });
  }

  public async loadNext(): Promise<void> {

    //Allows to load only one chuck of contacts at once
    if (this._isLoading || !this._hasMorePages){
      return;
    }

    this._isLoading = true;
    const result: IGetRequest = await this._api.get<IGetRequest>(`/contacts/?page=${this._currentPage}&limit=${this._limit}`);
    const contacts: IContact[] = result.data;
    
    runInAction((): void => {
      contacts.forEach((contact: IContact) => this._contacts.set(contact.id, contact));
      this._nextPage();
      this._hasMorePages = contacts.length === this._limit;
      this._isLoading = false;
    });
  }

  public async init(): Promise<void>{
    const result: IGetRequest = await this._api.get<IGetRequest>(`/contacts?page=${this._currentPage}&limit=${this._limit}`);
    const contacts: IContact[] = result.data;
    
    runInAction((): void => {
      this._contacts.clear();
      contacts.forEach((item: IContact) => this._contacts.set(item.id, item));
      this._nextPage();
    });
  }

  public get currentPage(): number{
    return this._currentPage;
  }

  public get hasMorePages(): boolean {
    return this._hasMorePages;
  }

  public get isloading(): boolean{
    return this._isLoading;
  }

  public get contacts(): IContact[]{
    return Array.from(this._contacts.values());
  }
}

export const contactsStore = new ContactsStore();