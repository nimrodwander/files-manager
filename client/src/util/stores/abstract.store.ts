export interface IPaginationStore {
  loadNext(): Promise<void>;
  hasMorePages: boolean;
  isloading: Boolean;
  currentPage: number;
}