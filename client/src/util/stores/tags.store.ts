import { makeAutoObservable, runInAction } from "mobx";
import { ITag } from "../entity/tag.entity";
import { ApiService } from "../api/api.service";
import { ITagGetResponse } from "./tags.types";
import { IStore } from "./abstract.store";


/**
 * Tag store holds all the tags in db
 * once init it gets the full list
 */
export class TagsStore implements IStore{
    private readonly _api: ApiService = new ApiService();
    private _tags: ITag[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public async init(): Promise<void>{
    await this.getMany();
  }

  public async getMany(): Promise<void>{
    const response: ITagGetResponse = await this._api.get<ITagGetResponse>('/tags');
    const tags: ITag[] = response.data;

    runInAction((): void => {
        this._tags = tags;
    })
  }

  public get tags(): ITag[]{
    return this._tags;
  }
}

export const tagsStore: TagsStore = new TagsStore();