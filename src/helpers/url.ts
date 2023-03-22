import { Request } from "@google-cloud/functions-framework";
import { AppError, INVALID_URL_PATH_ERROR } from "../app.errors";
import { match } from "path-to-regexp";

export function isRetailerRequest(req: Request): boolean {
  const parts = req.path.split("/");
  return parts.includes("retailer");
}

export type ItemPathParams = {
    key: string;
    platform: string;
}

export function getPlatformAndKeyFromPath(req: Request): ItemPathParams {
  return getPathParameters<ItemPathParams>('(.*)/:platform/:key',req);
}


export function getPathParameters<T extends object>(route: string, req: Request): T {
  const matcher = match<T>(route, { decode: decodeURIComponent });
  const result = matcher(req.path);

  if (result === false) {
    throw new AppError(INVALID_URL_PATH_ERROR(route));
  }

  return result.params;
}