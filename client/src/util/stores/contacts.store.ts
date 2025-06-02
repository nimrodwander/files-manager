import { makeAutoObservable, runInAction } from "mobx";
import { IContact } from "../entity/contact.entity";
import { ApiService } from "../api/api.service";
import { IPaginationStore, IStore } from "./abstract.store";
import { IContactCreateReponse, IContactDeleteResponse, IContactGetResponse, IContactUpdateResponse } from "./contacts.types";
import { Logger } from "../errors";

/*export class CRUD_Long_Map<Key, Value extends {id: string}> implements Map<Key, Value>{
  private _shortMap: Map<Key,Value> = new Map<Key,Value>();
  private _longMap: Map<Key,Value> = new Map<Key,Value>();

  public clear(): void{
    this._shortMap.clear();
    this._longMap.clear();
  }

  public delete(key: Key): boolean{
    const isDeletedFromLongMap: boolean = this._longMap.delete(key);
    const isDeletedFromShortMap: boolean = this._shortMap.delete(key);

    return isDeletedFromLongMap || isDeletedFromShortMap;
  }

  public has(key: Key): boolean{
    const isInLongMap = this._longMap.has(key);
    const isInShortMap = this._longMap.has(key);
    
    return isInLongMap || isInShortMap;
  }

  public get(key: Key): Value{
    const isInLongMap = this._longMap.has(key);
    const isInShortMap = this._longMap.has(key);
    
    if(isInLongMap){
      return this._longMap.get;
    }
  }

  public
}

export class NewContacts{
  private _contacts: Map<string, IContact> = new Map<string, IContact>();
  private readonly _api: ApiService = new ApiService();
  
  constructor() {
    makeAutoObservable(this);
  }

  public makeAuto
}*/

export class ContactsStore implements IStore, IPaginationStore{
  private readonly _api: ApiService = new ApiService();
  private readonly _limit: number = 20;
  private _contacts: Map<string, IContact> = new Map<string, IContact>();
  private _newContacts: Map<string, IContact> = new Map<string, IContact>();
  private _hasMorePages: boolean = true;
  private _isLoading: boolean = false;

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

  public get size(){
    return this._contacts.size + this._newContacts.size;
  }

  public async loadNext(): Promise<void> {

    //Allows to load only one chuck of contacts at once
    if (this._isLoading || !this._hasMorePages){
      return;
    }

    this._isLoading = true;
    const result: IContactGetResponse = await this._api.get<IContactGetResponse>(`/contacts/?skip=${this.size}&limit=${this._limit}`);
    const contacts: IContact[] = result.data;
    
    runInAction((): void => {
      contacts.forEach((contact: IContact) => this._contacts.set(contact.id, contact));
      this._hasMorePages = contacts.length === this._limit;
      this._isLoading = false;
    });
  }

  public async init(): Promise<void>{
    const result: IContactGetResponse = await this._api.get<IContactGetResponse>(`/contacts?skip=${this.size}&limit=${this._limit}`);
    const contacts: IContact[] = result.data;
    
    runInAction((): void => {
      this._contacts.clear();
      contacts.forEach((item: IContact) => this._contacts.set(item.id, item));
    });
  }

  public get hasMorePages(): boolean {
    return this._hasMorePages;
  }

  public get isloading(): boolean{
    return this._isLoading;
  }

  public get contactsIds(): string[]{
    return Array.from(this._contacts.keys());
  }

  public get newContactsIds(): string[]{
    return Array.from(this._newContacts.values())
    .sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((item) => item.id);
  }
}

export const contactsStore = new ContactsStore();

/*
export class ContactsStore implements IStore, IPaginationStore{
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
    this._isLoading = true;
    const response = await this._api.post<IContact, IContactCreateReponse>('/contacts', payload);
    const contact = response.data;

    runInAction((): void => {
      this._contacts = this._contacts.set(contact.id, contact);
      this._isLoading = false;
    });
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
    const result: IContactUpdateResponse = await this._api.put<IContact, IContactUpdateResponse>(`/contacts/${id}`, payload);
    const contact: IContact = result.data; 
    
    runInAction((): void => {
      this._contacts = this._contacts.set(contact.id, contact);
      this._isLoading = false;
    });
  }

  public async deleteOne(id: string): Promise<void>{
    this._isLoading = true;
    const result: IContactDeleteResponse = await this._api.delete<IContactDeleteResponse>(`/contacts/${id}`);

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
    const result: IContactGetResponse = await this._api.get<IContactGetResponse>(`/contacts/?page=${this._currentPage}&limit=${this._limit}`);
    const contacts: IContact[] = result.data;
    
    runInAction((): void => {
      contacts.forEach((contact: IContact) => this._contacts.set(contact.id, contact));
      this._nextPage();
      this._hasMorePages = contacts.length === this._limit;
      this._isLoading = false;
    });
  }

  public async init(): Promise<void>{
    const result: IContactGetResponse = await this._api.get<IContactGetResponse>(`/contacts?page=${this._currentPage}&limit=${this._limit}`);
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

  public get contactsIds(): string[]{
    return Array.from(this._contacts.keys());
  }
}

export const contactsStore = new ContactsStore();*/