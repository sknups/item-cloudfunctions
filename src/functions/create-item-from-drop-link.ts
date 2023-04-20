import { Request } from '@google-cloud/functions-framework';
import { Response } from 'express';
import { AllConfig } from '../config/all-config';
import { StatusCodes } from 'http-status-codes';
import { CreateItemFromDropLinkRequestDto } from '../dto/create-item-request.dto';
import { parseAndValidateRequestData } from '../helpers/validation';
import logger from '../helpers/logger';
import { getSkuOrThrow } from '../helpers/sku';
import { Sku } from '../client/catalog/catalog.client';
import { AppError, NOT_AVAILABLE_TO_RETAILER, SKU_ACTION_NOT_PERMITTED } from '../app.errors';
import { ItemEntity } from '../entity/item.entity';
import { createItemFromSku } from '../helpers/item';
import { RetailerItemMapper } from '../mapper/retailer/item-mapper-retailer';
import { Stock } from '../client/catalog/stock.client';
import { isRetailerRequest } from '../helpers/url';
import { createStockItemOrThrow } from '../helpers/stock';

export async function createItemFromDropLinkHandler(
  req: Request,
  res: Response,
  config: AllConfig,
): Promise<void> {

  if (req.method != 'POST') {
    res.status(StatusCodes.METHOD_NOT_ALLOWED).send(`${req.method} not allowed`);
    return;
  }

  if (isRetailerRequest(req)) {
    // We only expect giveaway-cloudfunctions to manufacture items via drop-links
    throw new AppError(NOT_AVAILABLE_TO_RETAILER);
  }

  // Parse request
  const dto: CreateItemFromDropLinkRequestDto = await parseAndValidateRequestData(CreateItemFromDropLinkRequestDto, req);
  logger.debug(`Received item-create-from-drop-link request for SKU ${dto.sku}`);

  // Retrieve SKU and perform further validations
  const sku: Sku = await getSkuOrThrow(config, dto.sku);
  if (sku.claimable) {
    throw new AppError(SKU_ACTION_NOT_PERMITTED(sku.code, 'redeemed', 'claimable attribute is set'));
  }

  // Check if user owns item from Sku
  let item: ItemEntity = null; // TODO (PLATFORM-3780) support idempotency for drop-links
  const userHasItem = item != null;

  if (!userHasItem) {
    // Request issue number if enumerated
    const stock: Stock | null = sku.maxQty ? await createStockItemOrThrow(config, sku, 'claim') : null;

    // Manufacture the item
    item = await createItemFromSku(config, sku, dto.user, stock?.issued, stock?.issue, dto.giveaway);
  }

  // Return populated retailer DTO
  const response = new RetailerItemMapper(config.assetsUrl, config.flexUrl).toDto(item);
  res.status(userHasItem ? StatusCodes.OK : StatusCodes.CREATED).json(response);

}
