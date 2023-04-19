import { AppError, OWNERSHIP_TOKEN_RETRIES_EXCEEDED } from '../app.errors';
import { randomBytes } from 'crypto';
import { ALREADY_EXISTS } from '../persistence/datastore-constants';
import { ItemRepository } from '../persistence/item-repository';
import { AuditEntity } from '../entity/audit.entity';
import { ItemEntity } from '../entity/item.entity';
import { commitTransaction, DatastoreContext, rollbackTransaction, startTransaction } from './datastore/datastore.helper';
import logger from './logger';
import { MutationResult } from './persistence/mutation-result';
import { publisher, repository } from './util';
import { Sku } from '../client/catalog/catalog.client';
import { itemEntityToItemEvent, skuToItemEntity } from './item-mapper';
import { ItemEventType } from '../eventstreaming/item-event';
import { AllConfig } from '../config/all-config';

const MAX_OWNERSHIP_TOKEN_RETRIES = 3;

function generateOwnershipToken(): string {
  return randomBytes(5).toString("hex");
}

export async function getUserItemForSku(
  platform: string,
  sku: Sku,
  user: string,
): Promise<ItemEntity | null> {
  const items = await repository().bySkuAndUser(platform, sku.code, user);
  return items.length > 0 ? items[0] : null
}

export async function createItemFromSku(
  config: AllConfig,
  sku: Sku,
  user: string,
  issued?: number,
  issue?: number,
  claimCode?: string,
): Promise<ItemEntity> {

  // Manufacture the item
  const item: ItemEntity = skuToItemEntity(
    sku,
    sku.code,
    generateOwnershipToken(),
    claimCode ?? null,
    issued ?? null,
    issue ?? null,
    user,
  );
  const audit: AuditEntity = await createItemAndAuditWithRetries(item);
  logger.info(`Manufactured item ${audit.entityId} for SKU ${item.stockKeepingUnitCode} with auditId ${audit.key}`);

  // Publish event
  const event = itemEntityToItemEvent(item, audit, audit.key.toString(), ItemEventType.CREATE);
  await publisher(config).publishEvent(event);

  return item;
}

async function createItemAndAuditWithRetries(item: ItemEntity): Promise<AuditEntity> {
  const audit: AuditEntity = {
    key: null,
    date: item.created,
    details: null,
    entityId: item.key,
    fromState: null,
    toState: 'UNBOXED / UNMINTED',
  };

  let remainingAttempts = MAX_OWNERSHIP_TOKEN_RETRIES;
  let success = false;
  let commitResponse: MutationResult[];
  let lastError: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  while (!success && remainingAttempts > 0) {
    remainingAttempts--;

    const context: DatastoreContext = await startTransaction(ItemRepository.context);

    try {
      await repository().insertItem(item, context);

      await repository().insertAudit(audit, context);

      commitResponse = await commitTransaction(context);
      success = true;
    } catch (e) {
      await rollbackTransaction(context);
      if (e.code == ALREADY_EXISTS) {
        logger.warn(`Ownership token ${item.key} in use, retry attempts remaining: ${remainingAttempts}`);
        item.key = generateOwnershipToken();
        lastError = new AppError(OWNERSHIP_TOKEN_RETRIES_EXCEEDED(MAX_OWNERSHIP_TOKEN_RETRIES), e);
      } else {
        throw e;
      }
    }
  }

  if (!success) {
    throw lastError;
  }

  const key = commitResponse.filter(m => m?.kind === 'audit')[0].key as number;

  return {
    ...audit,
    key,
  };
}
