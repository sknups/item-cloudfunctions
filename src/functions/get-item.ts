import { Request } from '@google-cloud/functions-framework';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../helpers/logger';
import { ItemRepository } from '../persistence/item-repository';
import { AppError, UNCATEGORIZED_ERROR } from '../app.errors';
import { ItemDTOMapper } from '../mapper/item-mapper';
import { AllConfig } from 'config/all-config';
import { ItemDto } from '../dto/item.dto';
import { ItemEntity } from '../entity/item.entity';

export class GetItem {

  public static repository = new ItemRepository();

  public static async handler(req: Request, res: Response, config: AllConfig): Promise<void> {
    if (req.method != 'GET') {
      res.status(StatusCodes.METHOD_NOT_ALLOWED).send(`${req.method} not allowed`);
      return;
    }

    const parts = req.path.split('/');
    const forRetailer: boolean = req.path.includes('/retailer');

    let platform;

    let token;

    if (parts.length > 1) {
      platform = parts[parts.length - 2];
      token = parts[parts.length - 1];
    }

    if (!platform || platform.length === 0 || !token || token.length === 0) {
      res.status(StatusCodes.BAD_REQUEST).send('platform code and ownership token (or nft.address) must be provided in path');
      return;
    }

    const keyType = token.startsWith('nft.') ? 'nftAddress' : 'token';
    if (keyType === 'nftAddress') {
      token = token.substring(4);
    }

    logger.debug(`Received request for drm-item - platform '${platform}' ${keyType} '${token}'`);
    let entity: ItemEntity;
    try {
      if (keyType === 'nftAddress') {
        entity = await GetItem.repository.byNftAddress(platform, token);
      } else {
        entity = await GetItem.repository.byThumbprint(platform, token);
      }

      if (entity === null) {
        logger.debug(`item not found platform '${platform}' ${keyType} '${token}'`);
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
      }

    } catch (e) {
      throw new AppError(UNCATEGORIZED_ERROR, e);
    }

    const mapper = new ItemDTOMapper(config.assetsUrl, config.flexUrl, config.sknAppUrl);
    const item: ItemDto = forRetailer ? mapper.toRetailerDto(entity) : mapper.toInternalDto(entity);

    res.status(StatusCodes.OK).json(item);
  }
}
