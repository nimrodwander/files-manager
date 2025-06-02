/**
 * Defines a set of interfaces for stores
 * Interfaces are small as possible accroding to SOLID
 */

export interface IInfiniteScrollStore {
  //Loads the next chunk of data
  loadNext(): Promise<void>;
  
  //Is the current chunk is still loading
  isloading: Boolean;
}

//Should be implemented by any store
export interface IStore{ 
  init: () => Promise<void>;
}