import { Request } from '@google-cloud/functions-framework';
import { Response } from 'express';
import { AllConfig } from '../config/all-config';
import { StatusCodes } from 'http-status-codes';
import { CreateItemRequestDto } from '../dto/create-item-request.dto';
import { parseAndValidateRequestData } from '../helpers/validation';
import logger from '../helpers/logger';
import { Sku } from '../client/catalog/catalog.client';
import { AppError, SKU_ACTION_NOT_PERMITTED, SKU_OUT_OF_STOCK, SKU_STOCK_NOT_INITIALISED, UPDATE_SKU_STOCK_FAILED } from '../app.errors';
import { Stock, updateStock } from '../client/catalog/stock.client';
import { itemEntityToItemEvent, skuToItemEntity } from '../helpers/item-mapper';
import { ItemEntity } from '../entity/item.entity';
import { createItemAndAuditWithRetries, generateOwnershipToken } from '../helpers/item';
import { AuditEntity } from '../entity/audit.entity';
import { ItemEventType } from '../eventstreaming/item-event';
import { publisher } from '../helpers/util';
import { RetailerItemMapper } from '../mapper/retailer/item-mapper-retailer';
import { getSkuOrThrow } from '../helpers/sku';

async function _updateStockOrThrow(cfg: AllConfig, skuCode: string): Promise<Stock> {
  try {
    return await updateStock(cfg, skuCode);
  } catch (e) {
    switch (e.response?.data?.code) {
      case 'STOCK_00400':
        throw new AppError(SKU_STOCK_NOT_INITIALISED(skuCode), e);
      case 'STOCK_00500':
        throw new AppError(SKU_OUT_OF_STOCK(skuCode), e);
      default:
        throw new AppError(UPDATE_SKU_STOCK_FAILED(skuCode), e);
    }
  }
}

export async function createItemHandler(
  req: Request,
  res: Response,
  config: AllConfig,
): Promise<void> {

  if (req.method != 'POST') {
    res.status(StatusCodes.METHOD_NOT_ALLOWED).send(`${req.method} not allowed`);
    return;
  }

  // Parse request
  const requestDto: CreateItemRequestDto = await parseAndValidateRequestData(CreateItemRequestDto, req);
  const isPurchaseRequest = !requestDto.claimCode;
  const giveawayCodeLogMsg = isPurchaseRequest ? '' : ` with giveaway code ${requestDto.claimCode}`;
  logger.debug(`Received item-create request for SKU ${requestDto.skuCode}${giveawayCodeLogMsg}`);

  // Retrieve SKU and perform further validations
  const sku: Sku = await getSkuOrThrow(config, requestDto.skuCode);
  const isEnumeratedSku: boolean = !!sku.maxQty;

  if (isPurchaseRequest && !sku.recommendedRetailPrice) {
    throw new AppError(SKU_ACTION_NOT_PERMITTED(sku.code,'purchased','missing price'));
  }

  // Manufacture the item

  let saleQty: number = null;
  if (isEnumeratedSku) {
    const skuStock = await _updateStockOrThrow(config, sku.code);
    saleQty = sku.maxQty - skuStock.stock;
  }

  const item: ItemEntity = skuToItemEntity(
    sku,
    requestDto.skuCode,
    generateOwnershipToken(),
    isPurchaseRequest ? null : requestDto.claimCode,
    saleQty,
    requestDto.user,
    config,
  );

  const audit: AuditEntity = await createItemAndAuditWithRetries(item);
  logger.info(`Manufactured item ${audit.entityId} for SKU ${item.stockKeepingUnitCode}${giveawayCodeLogMsg} with auditId ${audit.key}`);

  // Publish event

  const event = itemEntityToItemEvent(item, audit, audit.key.toString(), ItemEventType.CREATE);
  await publisher(config).publishEvent(event);

  // Return populated retailer DTO

  const response = new RetailerItemMapper(config.assetsUrl, config.flexUrl).toDto(item);
  res.status(StatusCodes.OK).json(response);

}
