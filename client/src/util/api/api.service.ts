import axios from "axios";
import { API_URL } from "../config";
import { CatchHttpError, get, post, put } from "./api.functions";

export class Api {
  //specify the base url of the api
  private readonly _apiUrl: string = API_URL;
  
  @CatchHttpError(get)
  public async get<T>(path: string): Promise<T>{
    const response = await axios.get<T>(`${this._apiUrl}${path}`);
    return response.data;
  }

  @CatchHttpError(put)
  public async put<T>(path: string, payload: T): Promise<T>{
      const response = await axios.put<T>(`${this._apiUrl}${path}`, payload);
      return response.data;
  }

  @CatchHttpError(post)
  public async post<T>(path: string, payload: T): Promise<T>{
      const response = await axios.post<T>(`${this._apiUrl}${path}`, payload);
      return response.data;
  }
}