import { Request } from '@google-cloud/functions-framework';
import { Response } from 'express';
import { AllConfig } from '../config/all-config';
import { StatusCodes } from 'http-status-codes';
import logger from '../helpers/logger';
import { parseAndValidateRequestData } from '../helpers/validation';
import { ItemEntity } from '../persistence/item-entity';
import { SkuEntity } from '../persistence/sku-entity';
import { ALREADY_EXISTS } from '../persistence/datastore-constants';
import { getEntity, insertEntity, transaction } from '../persistence/datastore-repository';
import { randomBytes } from 'crypto';
import { AuditEntity } from '../persistence/audit-entity';
import { EventPublisher } from '../eventstreaming/event-publisher';
import { itemEntityToCreateItemEvent, itemEntityToResponseDto, skuEntityToItemEntity } from '../helpers/item-mapper';
import { AppError, ITEM_CODE_RETRIES_EXCEEDED, SKU_NOT_FOUND, SKU_NOT_SUPPORTED } from '../app.errors';
import { ItemEvent } from '../eventstreaming/item-event';
import { CreateNonEnumeratedItemRequestDTO } from '../dto/create-non-enumerated-item-request.dto';

let _publisherInstance: EventPublisher<ItemEvent> = null;
function _publisher(cfg: AllConfig) {
  if (!_publisherInstance) {
    _publisherInstance = new EventPublisher(cfg.itemEventTopic);
  }
  return _publisherInstance;
}

const MAX_ITEM_CODE_RETRIES = 3;

async function _createItemAndAuditWithRetries(item: ItemEntity) {
  const audit = new AuditEntity();
  audit.date = item.created;
  audit.details = null;
  audit.fromState = null;
  audit.toState = 'UNBOXED / UNMINTED';
  let auditKey: string | number | Long = null;

  let itemCode: string = null;
  let remainingAttempts = MAX_ITEM_CODE_RETRIES;
  let success = false;
  let lastError: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  while (!success && remainingAttempts > 0) {
    remainingAttempts--;
    itemCode = randomBytes(5).toString('hex');
    audit.entityId = itemCode;

    const tx = transaction('drm');
    await tx.run();

    try {
      await insertEntity('drm', 'item', itemCode, item, tx);
      await insertEntity('drm', 'audit', null, audit, tx);
      const response = await tx.commit();
      auditKey = response[0].mutationResults
        .filter(r => r.key?.path?.length || 0 > 0)
        .map(r => r.key.path[0])
        .filter(k => k.kind == 'audit')[0].id;
      success = true;
    } catch (e) {
      await tx.rollback();
      if (e.code == ALREADY_EXISTS) {
        logger.warn(`Item code ${itemCode} in use, retry attempts remaining: ${remainingAttempts}`);
        itemCode = randomBytes(5).toString("hex");
        lastError = new AppError(ITEM_CODE_RETRIES_EXCEEDED(MAX_ITEM_CODE_RETRIES), e);
      } else {
        throw e;
      }
    }
  }

  if (!success) {
    throw lastError;
  }

  return { auditKey, audit };
}

async function _retrieveAndValidateSku(skuCode: string): Promise<SkuEntity> {
  const sku: SkuEntity | null = await getEntity(SkuEntity, 'catalog', 'sku', skuCode);
  if (!sku) {
    throw new AppError(SKU_NOT_FOUND(skuCode));
  }
  if (sku.version == '1' || sku.maxQty) {
    throw new AppError(SKU_NOT_SUPPORTED(skuCode));
  }
  return sku;
}

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
    const sku: SkuEntity = await _retrieveAndValidateSku(requestDto.skuCode);

    // Create item
    const item = skuEntityToItemEntity(
      sku,
      requestDto.skuCode,
      requestDto.claimCode,
      requestDto.email,
      requestDto.user,
      cfg,
    );
    const { auditKey, audit } = await _createItemAndAuditWithRetries(item);
    logger.info(`Manufactured item ${audit.entityId} from SKU "${item.stockKeepingUnitCode}" for giveaway "${item.claimCode}"`);

    // Publish event
    const event = itemEntityToCreateItemEvent(item, audit, auditKey.toString());
    await _publisher(cfg).publishEvent(event);

    const response = itemEntityToResponseDto(item, audit.entityId);
    res.status(StatusCodes.OK).json(response);
  }
}
