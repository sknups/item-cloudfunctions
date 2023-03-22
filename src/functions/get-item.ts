import { Request } from '@google-cloud/functions-framework';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../helpers/logger';
import { ItemRepository } from '../persistence/item-repository';
import { AppError, UNCATEGORIZED_ERROR } from '../app.errors';
import { InternalItemMapper } from '../mapper/internal/item-mapper-internal';
import { RetailerItemMapper } from '../mapper/retailer/item-mapper-retailer';
import { AllConfig } from 'config/all-config';
import { ItemDto } from '../dto/item.dto';
import { ItemEntity } from '../entity/item.entity';
import { getPlatformAndKeyFromPath, isRetailerRequest } from '../helpers/url';


export class GetItem {

  public static repository = new ItemRepository();

  public static async handler(req: Request, res: Response, config: AllConfig): Promise<void> {
    if (req.method != 'GET') {
      res.status(StatusCodes.METHOD_NOT_ALLOWED).send(`${req.method} not allowed`);
      return;
    }

    const {platform,key} = getPlatformAndKeyFromPath(req);
    const isRetailer = isRetailerRequest(req);

    // If the platform matches the magic string _NFT_ then query by nftAddress instead of token
    const keyType = (!isRetailer && platform == '_NFT_') ? 'nftAddress' : 'token';

    logger.debug(`Received request for drm-item - platform '${platform}' ${keyType} '${key}'`);
    let entity: ItemEntity;
    try {
      if (keyType === 'nftAddress') {
        entity = await GetItem.repository.byNftAddress(key);
      } else {
        entity = await GetItem.repository.byThumbprint(platform, key);
      }

      if (entity === null) {
        logger.debug(`item not found platform '${platform}' ${keyType} '${key}'`);
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
      }

    } catch (e) {
      throw new AppError(UNCATEGORIZED_ERROR, e);
    }

    const mapper = isRetailer ? new RetailerItemMapper(config.assetsUrl, config.flexUrl) : new InternalItemMapper();
    const item: ItemDto = mapper.toDto(entity);

    res.status(StatusCodes.OK).json(item);
  }
}
