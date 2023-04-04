import { Request } from '@google-cloud/functions-framework';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../helpers/logger';
import { ItemRepository } from '../persistence/item-repository';
import { AppError, NOT_AVAILABLE_TO_RETAILER } from '../app.errors';
import { getPlatformAndKeyFromPath, isRetailerRequest } from '../helpers/url';
import { InternalCountDto } from 'dto/internal/count';

export class CountItems {

  public static repository = new ItemRepository();

  public static async handler(req: Request, res: Response): Promise<void> {
    if (req.method != 'GET') {
      res.status(StatusCodes.METHOD_NOT_ALLOWED).send(`${req.method} not allowed`);
      return;
    }

    const {platform, key} = getPlatformAndKeyFromPath(req);
    const isRetailer = isRetailerRequest(req);
  
    if (isRetailer) {
      throw new AppError(NOT_AVAILABLE_TO_RETAILER);
    }

    logger.debug(`Received request for count - platform '${platform}' '${key}'`);
    
    const claimed = await CountItems.repository.countClaimed(platform, key);
    const purchased = await CountItems.repository.countPurchased(platform, key);

    const dto : InternalCountDto  = {
      claimed,
      purchased
    }

    res.status(StatusCodes.OK).json(dto);
  }
}
