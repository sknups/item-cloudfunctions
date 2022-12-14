import { StatusCodes } from 'http-status-codes';
import logger from './helpers/logger';

export type ErrorReason = {
  code: string;
  message: string;
  statusCode: number;
}

export class AppError extends Error {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(readonly reason: ErrorReason, cause?: any) {
    super(reason.message);
    const originalStackTrace = cause?.stack;
    if (originalStackTrace) {
      this.stack = `${this.stack}\nCaused by: ${originalStackTrace}`;
    }
  }
}

export function logAppError(error: AppError) {
  const logError: boolean = (logger.level == 'info' || logger.level == 'debug')
    || (error.reason.statusCode >= 500 && error.reason.statusCode < 600);
  if (logError) {
    logger.error(error);
  }
}

export function SKU_NOT_FOUND(sku: string): ErrorReason {
  return {
    code: 'CREATE_NON_ENUMERATED_ITEM_00001',
    message: `SKU with code ${sku} not found`,
    statusCode: StatusCodes.NOT_FOUND,
  }
}

export function SKU_NOT_SUPPORTED(sku: string): ErrorReason {
  return {
    code: 'CREATE_NON_ENUMERATED_ITEM_00002',
    message: `Giveaway not supported for sku ${sku}, it must be a v2 giveaway sku`,
    statusCode: StatusCodes.FORBIDDEN,
  }
}

export function ITEM_CODE_RETRIES_EXCEEDED(attempts: number): ErrorReason {
  return {
    code: 'CREATE_NON_ENUMERATED_ITEM_00100',
    message: `Could not assign an available item code after ${attempts} attempts`,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  }
}

export const UNCATEGORIZED_ERROR: ErrorReason = {
  code: 'CREATE_NON_ENUMERATED_ITEM_00900',
  message: 'An uncategorized error has occurred',
  statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
}
