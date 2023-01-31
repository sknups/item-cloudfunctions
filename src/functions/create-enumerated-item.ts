import { Request } from '@google-cloud/functions-framework';
import { Response } from 'express';
import { AllConfig } from '../config/all-config';
import { StatusCodes } from 'http-status-codes';
import logger from '../helpers/logger';
import { parseAndValidateRequestData } from '../helpers/validation';
import { itemEntityToItemEvent, skuToItemEntity } from '../helpers/item-mapper';
import { ItemEventType } from '../eventstreaming/item-event';
import { RetailerItemMapper } from '../mapper/retailer/item-mapper-retailer';
import { Sku } from '../client/catalog/catalog.client';
import { publisher } from '../helpers/util';
import { CreateEnumeratedItemRequestDTO } from '../dto/create-enumerated-item-request.dto';
import { Stock, updateStock } from '../client/catalog/stock.client';
import { AppError, UPDATE_SKU_STOCK_FAILED } from '../app.errors';
import { _createItemAndAuditWithRetries, _generateOwnershipToken } from '../helpers/item';
import { _retrieveAndValidatePurchaseSku } from '../helpers/sku';


export async function _updateStockOrThrow(cfg: AllConfig, skuCode: string): Promise<Stock> {
  const stock: Stock | null = await updateStock(cfg, skuCode);
  if (!stock) {
    throw new AppError(UPDATE_SKU_STOCK_FAILED(skuCode));
  }
  return stock;
}

export class CreateEnumeratedItem {
  public static async handler(req: Request, res: Response, cfg: AllConfig): Promise<void> {
    if (req.method != 'POST') {
      res.status(StatusCodes.METHOD_NOT_ALLOWED).send(`${req.method} not allowed`);
      return;
    }

    // Parse request
    const requestDto: CreateEnumeratedItemRequestDTO = await parseAndValidateRequestData(CreateEnumeratedItemRequestDTO, req);
    logger.debug(`Received request for create-enumerated-item for sku ${requestDto.skuCode}`);

    // Retrieve required data
    const sku: Sku = await _retrieveAndValidatePurchaseSku(cfg, requestDto.skuCode);

    //Decrement the stock 
    const skuStock = await _updateStockOrThrow(cfg, sku.code)

    const saleQty = sku.maxQty - skuStock.stock;

    // Create item
    const item = skuToItemEntity(
      sku,
      requestDto.skuCode,
      _generateOwnershipToken(),
      null,
      saleQty,
      requestDto.email,
      requestDto.user,
      cfg,
    );

    const audit = await _createItemAndAuditWithRetries(item);
    logger.info(`Manufactured item ${audit.entityId} from SKU "${item.stockKeepingUnitCode}" with auditId ${audit.key}`);

    // Publish event
    const event = itemEntityToItemEvent(item, audit, audit.key.toString(), ItemEventType.CREATE);
    await publisher(cfg).publishEvent(event);

    const response = new RetailerItemMapper(cfg.assetsUrl, cfg.flexUrl, cfg.sknAppUrl).toDto(item);
    res.status(StatusCodes.OK).json(response);
  }
}
