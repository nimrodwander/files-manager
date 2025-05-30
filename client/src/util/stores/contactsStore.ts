import { action, makeAutoObservable, makeObservable, observable, runInAction } from "mobx";
import { IContact, IGetRequest } from "../entity/contact";
import { Api } from "../api/api";

export class ContactsStore{
  private _data: Map<string, IContact> = new Map<string, IContact>();
  private readonly _api = new Api();
  private readonly _limit = 20;
  private _page = 1;
  private _hasMore = true;
  private _loading = false;

  constructor() {
    makeAutoObservable(this);
  }

   get loading(): boolean {
    return this._loading;
  }

  get hasMore(): boolean {
    return this._hasMore;
  }


  async loadMore() {
    if (this._loading || !this._hasMore) return;
    this._loading = true;

    try {
      const result = await this._api.get<IGetRequest>(`/contacts/?page=${this._page}&limit=${this._limit}`);
      runInAction(() => {
        this._data.clear();
        const data = result.data;
        data.forEach(contact => {
          this._data.set(contact.id, contact);
        });

        this._page += 1;
        this._hasMore = data.length === this._limit;
      });
    } catch (err) {
      console.error("Failed to load contacts", err);
    } finally {
      runInAction(() => {
        this._loading = false;
      });
    }
  }

  public async init(){
    const data: IGetRequest = await this._api.get<IGetRequest>(`/contacts?page=${this._page}&limit=${this._limit}`);
    this._page = this._page + 1;
    const contacts: IContact[] = data.data;
    
    runInAction(() => {
      for (let i = 0; i < contacts.length; i++) {
        this._data.set(contacts[i].id, contacts[i]);
      }
      console.log(this._data);
    });
    
  }

  public get data(): IContact[]{
    return Array.from(this._data.values());
  }
}

export const contactsStore = new ContactsStore();