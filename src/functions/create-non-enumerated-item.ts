import { Request } from '@google-cloud/functions-framework';
import { Response } from 'express';
import { AllConfig } from '../config/all-config';
import { StatusCodes } from 'http-status-codes';
import logger from '../helpers/logger';
import { parseAndValidateRequestData } from '../helpers/validation';
import { itemEntityToItemEvent, skuToItemEntity } from '../helpers/item-mapper';
import { ItemEventType } from '../eventstreaming/item-event';
import { CreateNonEnumeratedItemRequestDTO } from '../dto/create-non-enumerated-item-request.dto';
import { RetailerItemMapper } from '../mapper/retailer/item-mapper-retailer';
import { Sku } from '../client/catalog/catalog.client';
import { publisher } from '../helpers/util';
import { _createItemAndAuditWithRetries, _generateOwnershipToken } from '../helpers/item';
import { _retrieveAndValidateGiveawaySku } from '../helpers/sku';

export class CreateNonEnumeratedItem {
  public static async handler(req: Request, res: Response, cfg: AllConfig): Promise<void> {
    if (req.method != 'POST') {
      res.status(StatusCodes.METHOD_NOT_ALLOWED).send(`${req.method} not allowed`);
      return;
    }

    // Parse request
    const requestDto: CreateNonEnumeratedItemRequestDTO = await parseAndValidateRequestData(CreateNonEnumeratedItemRequestDTO, req);
    logger.debug(`Received request for create-non-enumerated-item for sku ${requestDto.skuCode} and claim ${requestDto.claimCode}`);

    // Retrieve required data
    const sku: Sku = await _retrieveAndValidateGiveawaySku(cfg, requestDto.skuCode);

    // Create item
    const item = skuToItemEntity(
      sku,
      requestDto.skuCode,
      _generateOwnershipToken(),
      requestDto.claimCode,
      null,
      requestDto.email,
      requestDto.user,
      cfg,
    );
    const audit = await _createItemAndAuditWithRetries(item);
    logger.info(`Manufactured item ${audit.entityId} from SKU "${item.stockKeepingUnitCode}" for giveaway "${item.claimCode}" with auditId ${audit.key}`);

    // Publish event
    const event = itemEntityToItemEvent(item, audit, audit.key.toString(), ItemEventType.CREATE);
    await publisher(cfg).publishEvent(event);

    const response = new RetailerItemMapper(cfg.assetsUrl, cfg.flexUrl, cfg.sknAppUrl).toDto(item);
    res.status(StatusCodes.OK).json(response);
  }
}
