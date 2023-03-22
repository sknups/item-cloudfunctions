import { Request } from '@google-cloud/functions-framework';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../helpers/logger';
import { ItemRepository } from '../persistence/item-repository';
import { AppError, NOT_AVAILABLE_TO_RETAILER, UNCATEGORIZED_ERROR } from '../app.errors';
import { ItemEntity } from '../entity/item.entity';
import { InternalItemMapper } from '../mapper/internal/item-mapper-internal';
import { getPlatformAndKeyFromPath, isRetailerRequest } from '../helpers/url';

export class FindLastIssued {

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


    logger.debug(`Received request for last issued - platform '${platform}' '${key}'`);
    let entity: ItemEntity;
    try {
      entity = await FindLastIssued.repository.findLastIssued(platform, key);
    } catch (e) {
      throw new AppError(UNCATEGORIZED_ERROR, e);
    }

    if (entity === null) {
      logger.debug(`no items found platform '${platform}' '${key}'`);
      res.sendStatus(StatusCodes.NOT_FOUND);
      return;
    }

    res.status(StatusCodes.OK).json(new InternalItemMapper().toDto(entity));
  }
}
