import { Request } from '@google-cloud/functions-framework';
import { Response } from 'express';
import { AllConfig } from '../config/all-config';
import { StatusCodes } from 'http-status-codes';
import { CreateItemFromPurchaseRequestDto } from '../dto/create-item-request.dto';
import { parseAndValidateRequestData } from '../helpers/validation';
import logger from '../helpers/logger';
import { getSkuOrThrow } from '../helpers/sku';
import { Sku } from '../client/catalog/catalog.client';
import { AppError, SKU_ACTION_NOT_PERMITTED } from '../app.errors';
import { ItemEntity } from '../entity/item.entity';
import { createItemFromSku } from '../helpers/item';
import { RetailerItemMapper } from '../mapper/retailer/item-mapper-retailer';
import { Stock } from '../client/catalog/stock.client';
import { createStockItemOrThrow } from '../helpers/stock';

export async function createItemFromPurchaseHandler(
  req: Request,
  res: Response,
  config: AllConfig,
): Promise<void> {

  if (req.method != 'POST') {
    res.status(StatusCodes.METHOD_NOT_ALLOWED).send(`${req.method} not allowed`);
    return;
  }

  // Parse request
  const dto: CreateItemFromPurchaseRequestDto = await parseAndValidateRequestData(CreateItemFromPurchaseRequestDto, req);
  logger.debug(`Received item-create-from-purchase request for SKU ${dto.sku}`);

  // Retrieve SKU and perform further validations
  const sku: Sku = await getSkuOrThrow(config, dto.sku);
  if (sku.claimable) {
    throw new AppError(SKU_ACTION_NOT_PERMITTED(sku.code, 'purchased', 'claimable attribute is set'));
  }
  if (!sku.recommendedRetailPrice) {
    throw new AppError(SKU_ACTION_NOT_PERMITTED(sku.code, 'purchased', 'price is not set'));
  }
  if (!sku.maxQty) {
    throw new AppError(SKU_ACTION_NOT_PERMITTED(sku.code, 'purchased', 'sku is not enumerated'));
  }

  // Check if user owns item from Sku
  let item: ItemEntity = null; // TODO (PLATFORM-3779) support idempotency for purchases
  const userHasItem = item != null;

  if (!userHasItem) {
    // Request issue number
    const stock: Stock = await createStockItemOrThrow(config, sku, 'purchase');

    // Manufacture the item
    item = await createItemFromSku(config, sku, dto.user, stock?.issued, stock?.issue);
  }

  // Return populated retailer DTO
  const response = new RetailerItemMapper(config.assetsUrl, config.flexUrl).toDto(item);
  res.status(userHasItem ? StatusCodes.OK : StatusCodes.CREATED).json(response);

}
