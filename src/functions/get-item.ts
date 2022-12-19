import { Request } from '@google-cloud/functions-framework';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../helpers/logger';
import { ItemRepository } from '../persistence/item-repository';
import { AppError, UNCATEGORIZED_ERROR } from '../app.errors';
import { ItemDTOMapper } from '../mapper/item-mapper';
import { AllConfig } from 'config/all-config';

export class GetItem {

  public static repository = new ItemRepository();

  public static async handler(req: Request, res: Response, config: AllConfig): Promise<void> {
    if (req.method != 'GET') {
      res.status(StatusCodes.METHOD_NOT_ALLOWED).send(`${req.method} not allowed`);
      return;
    }

    const parts = req.path.split('/')

    let platform;

    let token;

    if (parts.length > 1) {
      platform = parts[parts.length - 2];
      token = parts[parts.length - 1];
    }

    if (!platform || platform.length === 0 || !token || token.length === 0) {
      res.status(StatusCodes.BAD_REQUEST).send('platform code and ownership token must be provided in path');
      return;
    }

    logger.debug(`Received request for drm-item - platform '${platform}' token '${token}'`);
    let entity
    try {
      entity = await GetItem.repository.byThumbprint(platform,token);

      if (entity === null) {
        logger.debug(`item not found platform '${platform}' token '${token}'`);
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
      }

    } catch (e) {
      throw new AppError(UNCATEGORIZED_ERROR, e);
    }

    const item = new ItemDTOMapper(config.assetsUrl, config.flexUrl, config.sknAppUrl).toDTO(entity)

    res.status(StatusCodes.OK).json(item);
  }
}
