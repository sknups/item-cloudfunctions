import { Request } from '@google-cloud/functions-framework';
import { Response } from 'express';
import { AllConfig } from '../config/all-config';
import { StatusCodes } from 'http-status-codes';
import { CreateItemRequestDto } from '../dto/create-item-request.dto';
import { parseAndValidateRequestData } from '../helpers/validation';
import logger from '../helpers/logger';
import { Sku } from '../client/catalog/catalog.client';
import { AppError, SKU_ACTION_NOT_PERMITTED, OUT_OF_STOCK, STOCK_NOT_FOUND, CREATE_STOCK_ITEM_FAILED } from '../app.errors';
import { Stock, createStockItem } from '../client/catalog/stock.client';
import { ItemEntity } from '../entity/item.entity';
import { createItemFromSku } from '../helpers/item';
import { RetailerItemMapper } from '../mapper/retailer/item-mapper-retailer';
import { getSkuOrThrow } from '../helpers/sku';

async function _createStockItemOrThrow(cfg: AllConfig, platform: string, sku: string, type: 'claim' | 'purchase'): Promise<Stock> {
  try {
    return await createStockItem(cfg, platform, sku, type);
  } catch (e) {
    switch (e.response?.data?.code) {
      case 'STOCK_00400':
        throw new AppError(STOCK_NOT_FOUND(platform, sku), e);
      case 'STOCK_00500':
        throw new AppError(OUT_OF_STOCK(platform, sku), e);
      default:
        throw new AppError(CREATE_STOCK_ITEM_FAILED(platform, sku), e);
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
  const isEnumeratedSku = !!sku.maxQty;

  if (isPurchaseRequest && !sku.recommendedRetailPrice) {
    throw new AppError(SKU_ACTION_NOT_PERMITTED(sku.code, 'purchased', 'missing price'));
  }
  if (sku.claimable) {
    throw new AppError(SKU_ACTION_NOT_PERMITTED(sku.code, 'manufactured', 'giveaway SKU not supported'));
  }

  // Manufacture the item

  let issued: number = null;
  let issue: number = null;
  if (isEnumeratedSku) {
    const stockItemType = isPurchaseRequest ? 'purchase' : 'claim'
    const stockItem = await _createStockItemOrThrow(config, sku.platformCode, sku.code, stockItemType);
    issued = stockItem.issued;
    issue = stockItem.issue;
  }

  const item: ItemEntity = await createItemFromSku(
    config,
    sku,
    requestDto.user,
    issued,
    issue,
    isPurchaseRequest ? null : requestDto.claimCode,
  );

  // Return populated retailer DTO

  const response = new RetailerItemMapper(config.assetsUrl, config.flexUrl).toDto(item);
  res.status(StatusCodes.OK).json(response);

}
