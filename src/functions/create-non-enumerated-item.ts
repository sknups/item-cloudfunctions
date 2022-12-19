import { Request } from '@google-cloud/functions-framework';
import { Response } from 'express';
import { AllConfig } from '../config/all-config';
import { StatusCodes } from 'http-status-codes';
import logger from '../helpers/logger';
import { parseAndValidateRequestData } from '../helpers/validation';
import { SkuEntity } from '../persistence/sku-entity';
import { ALREADY_EXISTS } from '../persistence/datastore-constants';
import { randomBytes } from 'crypto';
import { EventPublisher } from '../eventstreaming/event-publisher';
import { itemEntityToCreateItemEvent, skuEntityToItemEntity } from '../helpers/item-mapper';
import { AppError, ITEM_CODE_RETRIES_EXCEEDED, SKU_NOT_FOUND, SKU_NOT_SUPPORTED } from '../app.errors';
import { ItemEvent } from '../eventstreaming/item-event';
import { CreateNonEnumeratedItemRequestDTO } from '../dto/create-non-enumerated-item-request.dto';
import { commitTransaction, DatastoreContext, rollbackTransaction, startTransaction } from '../helpers/datastore/datastore.helper';
import { ItemRepository } from '../persistence/item-repository';
import { ItemEntity } from '../entity/item.entity';
import { AuditEntity } from '../entity/audit.entity';
import { getEntity } from '../persistence/datastore-repository';
import { MutationResult } from '../helpers/persistence/mutation-result';
import { ItemDTOMapper } from '../mapper/item-mapper';

let _publisherInstance: EventPublisher<ItemEvent> = null;
function _publisher(cfg: AllConfig) {
  if (!_publisherInstance) {
    _publisherInstance = new EventPublisher(cfg.itemEventTopic);
  }
  return _publisherInstance;
}

const repository = new ItemRepository();

const MAX_ITEM_CODE_RETRIES = 3;

function _generateItemCode(): string {
  return randomBytes(5).toString("hex");
}

async function _createItemAndAuditWithRetries(item: ItemEntity): Promise<AuditEntity> {
  const audit: AuditEntity = {
    key: null,
    date: item.created,
    details: null,
    entityId: item.key,
    fromState: null,
    toState: 'UNBOXED / UNMINTED',
  };

  let remainingAttempts = MAX_ITEM_CODE_RETRIES;
  let success = false;
  let commitResponse: MutationResult[];
  let lastError: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  while (!success && remainingAttempts > 0) {
    remainingAttempts--;

    const context: DatastoreContext = await startTransaction(ItemRepository.context);

    try {
      await repository.insertItem(item, context);

      await repository.insertAudit(audit, context);

      commitResponse = await commitTransaction(context);
      success = true;
    } catch (e) {
      await rollbackTransaction(context);
      if (e.code == ALREADY_EXISTS) {
        logger.warn(`Item code ${item.key} in use, retry attempts remaining: ${remainingAttempts}`);
        item.key = _generateItemCode();
        lastError = new AppError(ITEM_CODE_RETRIES_EXCEEDED(MAX_ITEM_CODE_RETRIES), e);
      } else {
        throw e;
      }
    }
  }

  if (!success) {
    throw lastError;
  }

  audit.key = commitResponse.filter(m => m?.kind === 'audit')[0].key as number;

  return audit;
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
      _generateItemCode(),
      requestDto.claimCode,
      requestDto.email,
      requestDto.user,
      cfg,
    );
    const audit = await _createItemAndAuditWithRetries(item);
    logger.info(`Manufactured item ${audit.entityId} from SKU "${item.stockKeepingUnitCode}" for giveaway "${item.claimCode}" with auditId ${audit.key}`);

    // Publish event
    const event = itemEntityToCreateItemEvent(item, audit, audit.key.toString());
    await _publisher(cfg).publishEvent(event);

    const response = new ItemDTOMapper(cfg.assetsUrl, cfg.flexUrl, cfg.sknAppUrl).toDTO(item);
    res.status(StatusCodes.OK).json(response);
  }
}
