export interface IPaginationStore {
  loadNext(): Promise<void>;
  hasMorePages: boolean;
  isloading: Boolean;
  currentPage: number;
}

export interface IStore{
  init(): Promise<void>;
  createOne(): Promise<void>;
  updateOne(): Promise<void>;
  getMany(): Promise<void>;
  getOne(): Promise<void>;
}