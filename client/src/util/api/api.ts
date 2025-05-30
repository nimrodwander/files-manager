import axios from "axios";
import { API_URL } from "../config";
import { EHttpStatus } from "./http";

export class Api {
  //specify the base url of the api
  private readonly _apiUrl: string = API_URL;

  public loadingStatus: EHttpStatus = EHttpStatus.Fulfilled;
  
  public async get<T>(path: string): Promise<T>{
    try{
      this.loadingStatus = EHttpStatus.Loading;
      const response = await axios.get<T>(`${this._apiUrl}${path}`);
      this.loadingStatus = EHttpStatus.Fulfilled;
      return response.data;
    }
    catch(err){
      this.loadingStatus =  EHttpStatus.Rejected;
      throw new Error("Could not get data");
    }
  }

  public async put<T>(path: string, payload: T): Promise<T>{
      const response = await axios.put<T>(`${this._apiUrl}${path}`, payload);
      return response.data;
  }

  public async post<T>(path: string, payload: T): Promise<T>{
      const response = await axios.post<T>(`${this._apiUrl}${path}`, payload);
      return response.data;
  }
}