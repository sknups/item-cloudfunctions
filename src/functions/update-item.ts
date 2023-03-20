import { Request } from '@google-cloud/functions-framework';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError, ITEM_NOT_FOUND, SKU_ACTION_NOT_PERMITTED, UNEXPECTED_NFT_STATE } from '../app.errors';
import { AllConfig } from '../config/all-config';
import { UpdateItemRequestDto, UpdateItemOperation } from '../dto/update-item-request.dto';
import { AuditEntity } from '../entity/audit.entity';
import { ItemEntity } from '../entity/item.entity';
import { ItemEventType } from '../eventstreaming/item-event';
import { commitTransaction, DatastoreContext, rollbackTransaction, startTransaction } from '../helpers/datastore/datastore.helper';
import { itemEntityToItemEvent } from '../helpers/item-mapper';
import logger from '../helpers/logger';
import { parsePath, publisher, repository } from '../helpers/util';
import { parseAndValidateRequestData } from '../helpers/validation';
import { RetailerItemMapper } from '../mapper/retailer/item-mapper-retailer';
import { ItemRepository } from '../persistence/item-repository';
import { MutationResult } from '../helpers/persistence/mutation-result';
import { Sku } from '../client/catalog/catalog.client';
import { getSkuOrThrow } from '../helpers/sku';

const _OPERATION_TO_NFT_STATE = {
  [UpdateItemOperation.MINTED]: {
    fromNftState: 'MINTING',
    toNftState: 'MINTED',
  },
  [UpdateItemOperation.MINTING]: {
    fromNftState: 'UNMINTED',
    toNftState: 'MINTING',
  },
  [UpdateItemOperation.MINT_FAILED]: {
    fromNftState: 'MINTING',
    toNftState: 'UNMINTED',
  },
  [UpdateItemOperation.OWNER_ADDRESS]: {
    fromNftState: 'MINTED',
    toNftState: 'MINTED',
  },
}

export async function updateItemHandler(req: Request, res: Response, config: AllConfig): Promise<void> {
  if (req.method != 'POST') {
    res.status(StatusCodes.METHOD_NOT_ALLOWED).send(`${req.method} not allowed`);
    return;
  }

  // Parse request
  const pathParams = parsePath(req, res);
  if (!pathParams) {
    return;
  }

  const requestDto: UpdateItemRequestDto = await parseAndValidateRequestData(UpdateItemRequestDto, req);
  const operationData = _OPERATION_TO_NFT_STATE[requestDto.operation];
  if (!operationData) {
    res.status(StatusCodes.BAD_REQUEST).send(`Operation ${requestDto.operation} not supported`);
    return;
  }
  logger.debug(`Received request for update-item for ${pathParams.key} with operation ${requestDto.operation}`);

  // Process request
  const context: DatastoreContext = await startTransaction(ItemRepository.context);

  let commitResponse: MutationResult[];
  let itemEntity: ItemEntity = null;
  let newItemEntity: ItemEntity = null;
  let auditEntity: AuditEntity = null;

  try {
    itemEntity = await repository().byThumbprint(pathParams.platform, pathParams.key, context);

    if (!itemEntity) {
      throw new AppError(ITEM_NOT_FOUND(pathParams.platform, pathParams.key));
    }

    if (itemEntity.nftState != operationData.fromNftState) {
      throw new AppError(UNEXPECTED_NFT_STATE(operationData.fromNftState, itemEntity.nftState));
    }

    const sku: Sku = await getSkuOrThrow(config, itemEntity.stockKeepingUnitCode);

    switch (requestDto.operation) {

      case UpdateItemOperation.MINTING: {
        if (!sku.permissions.includes('METAPLEX_MINT')) {
          throw new AppError(SKU_ACTION_NOT_PERMITTED(sku.code,'minting','missing METAPLEX_MINT permission'));
        }

        [newItemEntity, auditEntity] = await _updateEntity(context, itemEntity, {
          nftState: operationData.toNftState,
          nftAddress: requestDto.nftAddress,
          ownerAddress: requestDto.ownerAddress,
        });

        break;
      }

      case UpdateItemOperation.MINTED: {
        [newItemEntity, auditEntity] = await _updateEntity(context, itemEntity, {
          nftState: operationData.toNftState,
          user: null,
        });

        break;
      }

      case UpdateItemOperation.MINT_FAILED: {
        [newItemEntity, auditEntity] = await _updateEntity(context, itemEntity, {
          nftState: operationData.toNftState,
          nftAddress: null,
          ownerAddress: null,
        });

        break;
      }

      case UpdateItemOperation.OWNER_ADDRESS: {
        [newItemEntity, auditEntity] = await _updateEntity(context, itemEntity, {
          ownerAddress: requestDto.ownerAddress,
        });

        break;
      }

    }

    commitResponse = await commitTransaction(context);

  } catch (e) {
    await rollbackTransaction(context);
    throw e;
  }

  if (newItemEntity && [UpdateItemOperation.MINTED, UpdateItemOperation.OWNER_ADDRESS].includes(requestDto.operation)) {
    const auditKey = commitResponse.filter(m => m?.kind === 'audit')[0].key as number;
    logger.info(`Updated item ${auditEntity.entityId} with auditId ${auditKey}`);

    // Publish event
    const eventType = requestDto.operation == UpdateItemOperation.MINTED ? ItemEventType.MINT : ItemEventType.NFT_TRANSFER;
    const event = itemEntityToItemEvent(newItemEntity, auditEntity, auditKey.toString(), eventType);
    await publisher(config).publishEvent(event);
  }

  const response = new RetailerItemMapper(config.assetsUrl, config.flexUrl).toDto(newItemEntity || itemEntity);
  res.status(StatusCodes.OK).json(response);

}

async function _updateEntity(context: DatastoreContext, oldEntity: ItemEntity, updates: Partial<ItemEntity>): Promise<[ItemEntity, AuditEntity]> {
  const updated = new Date();
  const newEntity = { ...oldEntity, ...updates, updated };

  const details = {};
  for (const k of Object.keys(updates)) {
    if (oldEntity[k] && k != 'nftState') {
      details[k] = oldEntity[k];
    }
  }

  const audit: AuditEntity = {
    date: updated,
    details: Object.keys(details).length > 0 ? JSON.stringify(details) : null,
    entityId: newEntity.key,
    fromState: `UNBOXED / ${oldEntity.nftState}`,
    toState: `UNBOXED / ${newEntity.nftState}`,
    key: null,
  }

  await repository().updateItem(newEntity, context);
  await repository().insertAudit(audit, context);

  return [newEntity, audit];
}
