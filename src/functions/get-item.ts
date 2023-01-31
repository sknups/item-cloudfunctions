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
import { parsePath } from '../helpers/util';

export class GetItem {

  public static repository = new ItemRepository();

  public static async handler(req: Request, res: Response, config: AllConfig): Promise<void> {
    if (req.method != 'GET') {
      res.status(StatusCodes.METHOD_NOT_ALLOWED).send(`${req.method} not allowed`);
      return;
    }

    const pathParams = parsePath(req, res);
    if (!pathParams) {
      return;
    }

    // If the platform matches the magic string _NFT_ then query by nftAddress instead of token
    const keyType = (!pathParams.retailer && pathParams.platform == '_NFT_') ? 'nftAddress' : 'token';

    logger.debug(`Received request for drm-item - platform '${pathParams.platform}' ${keyType} '${pathParams.key}'`);
    let entity: ItemEntity;
    try {
      if (keyType === 'nftAddress') {
        entity = await GetItem.repository.byNftAddress(pathParams.key);
      } else {
        entity = await GetItem.repository.byThumbprint(pathParams.platform, pathParams.key);
      }

      if (entity === null) {
        logger.debug(`item not found platform '${pathParams.platform}' ${keyType} '${pathParams.key}'`);
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
      }

    } catch (e) {
      throw new AppError(UNCATEGORIZED_ERROR, e);
    }

    const mapper = pathParams.retailer ? new RetailerItemMapper(config.assetsUrl, config.flexUrl, config.sknAppUrl) : new InternalItemMapper();
    const item: ItemDto = mapper.toDto(entity);

    res.status(StatusCodes.OK).json(item);
  }
}
