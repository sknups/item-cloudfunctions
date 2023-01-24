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
    code: 'ITEM_00001',
    message: `SKU with code ${sku} not found`,
    statusCode: StatusCodes.NOT_FOUND,
  }
}

export function SKU_NOT_SUPPORTED_GIVEAWAY(sku: string): ErrorReason {
  return {
    code: 'ITEM_00002',
    message: `Giveaway not supported for sku ${sku}, it must be a v2 giveaway sku`,
    statusCode: StatusCodes.FORBIDDEN,
  }
}

export function SKU_PERMISSION_MISSING(sku: string, permission: string): ErrorReason {
  return {
    code: 'ITEM_00003',
    message: `Required permission ${permission} does not exist on sku ${sku}`,
    statusCode: StatusCodes.FORBIDDEN,
  }
}

export function SKU_NOT_SUPPORTED_PURCHASE(sku: string): ErrorReason {
  return {
    code: 'ITEM_00004',
    message: `Purchase not supported for sku ${sku}, it must have the 'SELL' permission and a quantity`,
    statusCode: StatusCodes.FORBIDDEN,
  }
}

export function UPDATE_SKU_STOCK_FAILED(sku: string): ErrorReason {
  return {
    code: 'ITEM_00005',
    message: `Failed to update stock for sku ${sku}`,
    statusCode: StatusCodes.FORBIDDEN,
  }
}


/**
 * This error may occur if there is a collision when generating an ownership token.
 *
 * The token is 10 hex characters (40 bits) which provides 2^40 unique tokens.
 * As more tokens are generated the chance of a collision will increase.
 *
 * 1 billion tokens represents ~1/1100th of the available range which means
 * there is a ~0.1% chance of a collision after 1 billion tokens are already assigned.
 *
 * The chance of this error is even lower as collisions are retried.
 */
export function OWNERSHIP_TOKEN_RETRIES_EXCEEDED(attempts: number): ErrorReason {
  return {
    code: 'ITEM_00100',
    message: `Could not assign an available ownership token after ${attempts} attempts`,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  }
}

export function UNEXPECTED_NFT_STATE(expectedState: string, actual: string): ErrorReason {
  return {
    code: 'ITEM_00101',
    message: `Expected item to be in state ${expectedState} but was ${actual}`,
    statusCode: StatusCodes.CONFLICT,
  }
}

export function ITEM_NOT_FOUND(platform: string, token: string): ErrorReason {
  return {
    code: 'ITEM_00102',
    message: `Item with platform ${platform} and code ${token} not found`,
    statusCode: StatusCodes.NOT_FOUND,
  }
}

export const UNCATEGORIZED_ERROR: ErrorReason = {
  code: 'ITEM_00900',
  message: 'An uncategorized error has occurred',
  statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
}
