import axios from "axios";
import { API_URL } from "../config";
import { EHttpStatus } from "./http";

export class Api {
  //specify the base url of the api
  private readonly _apiUrl: string = API_URL;
  
  public async get<T>(path: string): Promise<T>{
    try{
      const response = await axios.get<T>(`${this._apiUrl}${path}`);
      return response.data;
    }
    catch(err){
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