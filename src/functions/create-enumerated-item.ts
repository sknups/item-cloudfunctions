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
import { CreateItemRequestDto } from '../dto/create-item-request.dto';
import { AppError, SKU_NOT_ENUMERATED } from '../app.errors';
import { createItemHandler } from './create-item';

export class CreateEnumeratedItem {
  public static async handler(req: Request, res: Response, cfg: AllConfig): Promise<void> {
    await createItemHandler(req, res, cfg, (dto: CreateItemRequestDto, isEnumerated: boolean) => {
      if (!isEnumerated) {
        throw new AppError(SKU_NOT_ENUMERATED(dto.skuCode));
      }
    });
  }
}
