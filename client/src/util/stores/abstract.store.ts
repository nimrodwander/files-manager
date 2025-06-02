export interface IPaginationStore {
  loadNext(): Promise<void>;
  hasMorePages: boolean;
  isloading: Boolean;
}

export interface IStore{
  init: () => Promise<void>;
}