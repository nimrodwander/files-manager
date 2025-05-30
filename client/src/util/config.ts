import { logger } from "./errors";

export const API_URL = process.env.REACT_APP_API_URL || logger.throwIIFEError("Missing REACT_APP_API_URL");
export const STDDateTimeFormat = "DD/MM/YYYY - HH:mm";
