import { Request } from '@google-cloud/functions-framework';
import { Response } from 'express';
import { AllConfig } from '../config/all-config';
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
