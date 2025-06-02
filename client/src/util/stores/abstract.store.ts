export interface IPaginationStore {
  loadNext(): Promise<void>;
  isloading: Boolean;
}

export interface IStore{
  init: () => Promise<void>;
}