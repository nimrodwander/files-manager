import { makeAutoObservable } from "mobx";

export class Store{
  constructor() {
      makeAutoObservable(this);
  }

  public async init(): Promise<void>{

  }
}

export const store: Store = new Store();