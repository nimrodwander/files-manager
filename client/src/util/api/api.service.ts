import axios from "axios";
import { API_URL } from "../config";
import { CatchHttpError, get, post, put, remove } from "./api.functions";

/**
 * A util class for calling to the server enables:
 * 1. Custom error handling with a try catch decorator 
 * 3. Allows consumer code to specify only the designated path and not the whole URL 
 */
export class ApiService {
  //Specify the base url of the api defined in .env file \ config file
  private readonly _apiUrl: string = API_URL;
  
  @CatchHttpError(get)
  public async get<TResponse>(path: string): Promise<TResponse>{
    const response = await axios.get<TResponse>(`${this._apiUrl}${path}`);
    return response.data;
  }

  @CatchHttpError(put)
  public async put<TPayload, TResponse>(path: string, payload: TPayload): Promise<TResponse>{
      const response = await axios.put<TResponse>(`${this._apiUrl}${path}`, payload);
      return response.data;
  }

  @CatchHttpError(post)
  public async post<TPayload, TResponse>(path: string, payload: TPayload): Promise<TResponse>{
      const response = await axios.post<TResponse>(`${this._apiUrl}${path}`, payload);
      return response.data;
  }

  @CatchHttpError(remove)
  public async delete<TResponse>(path: string): Promise<TResponse>{
      const response = await axios.delete<TResponse>(`${this._apiUrl}${path}`);
      return response.data;
  }
}