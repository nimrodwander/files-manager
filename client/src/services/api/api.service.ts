import axios from "axios";
import { ConfigService } from "../config/config";
import { CatchHttpError, get, post, put, remove } from "./api.functions";

export class ApiService {
  @CatchHttpError(get)
  public async get<TResponse>(path: string): Promise<TResponse>{
    const response = await axios.get<TResponse>(`${ConfigService.API_URL}${path}`);
    return response.data;
  }

  @CatchHttpError(put)
  public async put<TPayload, TResponse>(path: string, payload: TPayload): Promise<TResponse>{
      const response = await axios.put<TResponse>(`${ConfigService.API_URL}${path}`, payload);
      return response.data;
  }

  @CatchHttpError(post)
  public async post<TPayload, TResponse>(path: string, payload: TPayload): Promise<TResponse>{
      const response = await axios.post<TResponse>(`${ConfigService.API_URL}${path}`, payload);
      return response.data;
  }

  @CatchHttpError(remove)
  public async delete<TResponse>(path: string): Promise<TResponse>{
      const response = await axios.delete<TResponse>(`${ConfigService.API_URL}${path}`);
      return response.data;
  }
}

export const apiService: ApiService = new ApiService();