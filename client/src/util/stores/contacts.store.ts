import { makeAutoObservable, runInAction } from "mobx";
import { IContact } from "../entity/contact.entity";
import { Api } from "../api/api.service";
import { IPaginationStore } from "./abstract.store";
import { IGetRequest } from "./contacts.types";

export class ContactsStore implements IPaginationStore{
  private readonly _api: Api = new Api();
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