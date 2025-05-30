import { Logger } from "./errors";

export const API_URL = process.env.REACT_APP_API_URL || Logger.error("Missing REACT_APP_API_URL");