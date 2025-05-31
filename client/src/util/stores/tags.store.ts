import { makeAutoObservable, makeObservable, runInAction } from "mobx";
import { ITag } from "../entity/tag.entity";
import { ApiService } from "../api/api.service";
import { ITagGetResponse } from "./tags.types";
import { IStore } from "./abstract.store";

export class TagsStore implements IStore{
    private readonly _api: ApiService = new ApiService();
    private _tags: ITag[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public async init(){
    await this.loadNext();
  }

  public async loadNext(){
    const response: ITagGetResponse = await this._api.get<ITagGetResponse>('/tags');
    const tags = response.data;

    runInAction(() => {
        this._tags = tags;
    })
  }

  public get tags(){
    return this._tags;
  }
}

export const tagsStore: TagsStore = new TagsStore();