import { Request } from '@google-cloud/functions-framework';
import { Response } from 'express';
import { AllConfig } from '../config/all-config';
import { StatusCodes } from 'http-status-codes';
import { CreateItemFromGiveawayRequestDto } from '../dto/create-item-request.dto';
import { parseAndValidateRequestData } from '../helpers/validation';
import logger from '../helpers/logger';
import { getSkuOrThrow } from '../helpers/sku';
import { Sku } from '../client/catalog/catalog.client';
import { AppError, SKU_ACTION_NOT_PERMITTED } from '../app.errors';
import { ItemEntity } from '../entity/item.entity';
import { createItemFromSku, getUserItemForSku } from '../helpers/item';
import { RetailerItemMapper } from '../mapper/retailer/item-mapper-retailer';

export async function createItemFromGiveawayHandler(
  req: Request,
  res: Response,
  config: AllConfig,
): Promise<void> {

  if (req.method != 'POST') {
    res.status(StatusCodes.METHOD_NOT_ALLOWED).send(`${req.method} not allowed`);
    return;
  }

  // Parse request
  const dto: CreateItemFromGiveawayRequestDto = await parseAndValidateRequestData(CreateItemFromGiveawayRequestDto, req);
  logger.debug(`Received item-create-from-giveaway request for SKU ${dto.sku}`);

  // Retrieve SKU and perform further validations
  const sku: Sku = await getSkuOrThrow(config, dto.sku);
  if (!sku.claimable) {
    throw new AppError(SKU_ACTION_NOT_PERMITTED(sku.code, 'claimed', 'claimable attribute not set'));
  }
  if (sku.recommendedRetailPrice) {
    throw new AppError(SKU_ACTION_NOT_PERMITTED(sku.code, 'claimed', 'price is set'));
  }
  if (sku.maxQty) {
    throw new AppError(SKU_ACTION_NOT_PERMITTED(sku.code, 'claimed', 'it is enumerated'));
  }

  //Check if user owns item from Sku
  let item: ItemEntity = await getUserItemForSku('SKN',sku, dto.user);
  const userHasItem = item != null

  if (!userHasItem) {
    // Manufacture the item
    item = await createItemFromSku(config, sku, dto.user);
  }

  // Return populated retailer DTO
  const response = new RetailerItemMapper(config.assetsUrl, config.flexUrl).toDto(item);
  res.status(userHasItem ? StatusCodes.OK : StatusCodes.CREATED).json(response);

}
