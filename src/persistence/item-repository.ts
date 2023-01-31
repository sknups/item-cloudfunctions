import { AuditEntity } from '../entity/audit.entity';
import { ItemEntity } from '../entity/item.entity';
import { createContext, DatastoreContext, findEntities, getEntity, insertEntity, updateEntity } from '../helpers/datastore/datastore.helper';
import logger from '../helpers/logger';

export class ItemRepository {

  public static context = createContext('drm');

  public async byEmailHash(platformCode: string, emailHash: string): Promise<ItemEntity[]> {
    logger.debug(`getItemsByEmailHash - platformCode = '${platformCode}' emailHash = '${emailHash}'`)

    return await findEntities<ItemEntity>(
      ItemRepository.context,
      'item',
      [
        { name: 'platformCode', op: '=', val: platformCode },
        { name: 'emailHash', op: '=', val: emailHash },
      ],
    ).then(items => items.filter(item => item.state !== 'DELETED'));
  }

  public async byWalletAddress(platformCode: string, ownerAddress: string): Promise<ItemEntity[]> {
    logger.debug(`getItemsByWalletAddress - platformCode = '${platformCode}' ownerAddress = '${ownerAddress}'`)

    return await findEntities<ItemEntity>(
      ItemRepository.context,
      'item',
      [
        { name: 'platformCode', op: '=', val: platformCode },
        { name: 'ownerAddress', op: '=', val: ownerAddress },
      ],
    ).then(items => items.filter(item => item.state !== 'DELETED' && item.nftState === 'MINTED'));
  }

  public async byUser(platformCode: string, user: string): Promise<ItemEntity[]> {
    logger.debug(`byUser - platformCode = '${platformCode}' user = '${user}'`)

    return await findEntities<ItemEntity>(
      ItemRepository.context,
      'item',
      [
        { name: 'platformCode', op: '=', val: platformCode },
        { name: 'user', op: '=', val: user },
      ],
    ).then(items => items.filter(item => item.state !== 'DELETED'));
  }

  public async byThumbprint(platformCode: string, thumbprint: string, context?: DatastoreContext): Promise<ItemEntity | null> {
    logger.debug(`byThumbprint - platformCode = '${platformCode}' thumbprint = '${thumbprint}'`)

    const item: ItemEntity = await getEntity(context ?? ItemRepository.context, 'item', thumbprint);

    if (item && item.platformCode === platformCode && item.state !== 'DELETED') {
      return item;
    } else {
      return null;
    }
  }

  public async byNftAddress(nftAddress: string, context?: DatastoreContext): Promise<ItemEntity | null> {
    logger.debug(`byNftAddress - nftAddress = '${nftAddress}'`)

    const items: ItemEntity[] = await findEntities(
      context ?? ItemRepository.context,
      'item',
      [{ name: 'nftAddress', op: '=', val: nftAddress }],
    );

    const item = items.length > 0 ? items[0] : null;
    if (item && item.state !== 'DELETED') {
      return item;
    } else {
      return null;
    }
  }

  public async insertItem(item: ItemEntity, context?: DatastoreContext): Promise<void> {
    logger.debug(`insertItem - ownershipToken = '${item.key}' platformCode = '${item.platformCode}'`);

    await insertEntity(context ?? ItemRepository.context, 'item', item);
  }

  public async updateItem(item: ItemEntity, context: DatastoreContext): Promise<void> {
    logger.debug(`updateItem - ownershipToken = '${item.key}' platformCode = '${item.platformCode}'`);

    await updateEntity(context, 'item', item);
  }

  public async insertAudit(audit: AuditEntity, context: DatastoreContext): Promise<void> {
    logger.debug(`insertAudit - entityId = '${audit.entityId}' toState = '${audit.toState}'`);

    await insertEntity(context, 'audit', audit);
  }

}
