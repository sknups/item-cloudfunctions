import { Request } from '@google-cloud/functions-framework';
import { Response } from 'express';
import { AllConfig } from '../config/all-config';
import { StatusCodes } from 'http-status-codes';
import { GetItemsRequestDTO } from '../dto/get-items-request.dto';
import logger from '../helpers/logger';
import { parseAndValidateRequestData } from '../helpers/validation';
import { ItemRepository } from '../persistence/item-repository';
import { AppError, UNCATEGORIZED_ERROR } from '../app.errors';
import { hashEmail } from '../hashing';
import { RetailerItemMapper } from '../mapper/retailer/item-mapper-retailer';

export class GetItems {

  public static repository = new ItemRepository();

  public static async handler(req: Request, res: Response, config: AllConfig): Promise<void> {
    if (req.method != 'POST') {
      res.status(StatusCodes.METHOD_NOT_ALLOWED).send(`${req.method} not allowed`);
      return;
    }

    const getItemsReq: GetItemsRequestDTO = await parseAndValidateRequestData(GetItemsRequestDTO, req);
    logger.debug('Received request for drm-get-items');

    try {

      const entities = []
      const itemIds = new Set<string>();

      if (getItemsReq.emailAddress) {
        const emailHash = hashEmail(getItemsReq.emailAddress, config.emailHashingSecret);
        const itemsFromEmail = await GetItems.repository.byEmailHash(getItemsReq.platformCode, emailHash);
        for(const item of itemsFromEmail){ 
          if (!itemIds.has(item.key)) {
            entities.push(item)
            itemIds.add(item.key)
          }
        }
      }

      if (getItemsReq.user) {
        const itemsFromUser = await GetItems.repository.byUser(getItemsReq.platformCode, getItemsReq.user);
        for(const item of itemsFromUser){ 
          if (!itemIds.has(item.key)) {
            entities.push(item)
            itemIds.add(item.key)
          }
        }
      }

      if (getItemsReq.blockchainAddress) {
        const itemsFromWallets = await GetItems.repository.byWalletAddress(getItemsReq.platformCode, getItemsReq.blockchainAddress);  
        for(const item of itemsFromWallets){ 
          if (!itemIds.has(item.key)) {
            entities.push(item)
            itemIds.add(item.key)
          }
        }
      }

      const mapper = new RetailerItemMapper(config.assetsUrl, config.flexUrl, config.sknAppUrl)
      const items = entities.map(entity => mapper.toDto(entity))
    
      res.status(StatusCodes.OK).json(items);
    } catch (e) {
      logger.error(e)
      throw new AppError(UNCATEGORIZED_ERROR, e);
    }
  }
}
