import { AuditEntity } from '../entity/audit.entity';
import { ItemEntity, ITEM_PROJECTION, ProjectedItemEntity } from '../entity/item.entity';
import { createContext, DatastoreContext, findEntities, getEntity, insertEntity } from '../helpers/datastore/datastore.helper';
import logger from '../helpers/logger';

export class ItemRepository {

  public static context = createContext('drm');

  public async byEmailHash(platformCode: string, emailHash: string): Promise<ProjectedItemEntity[]> {
    logger.debug(`getItemsByEmailHash - platformCode = '${platformCode}' emailHash = '${emailHash}'`)

    return await findEntities(
      ItemRepository.context,
      'item',
      [
        { name: 'platformCode', op: '=', val: platformCode },
        { name: 'emailHash', op: '=', val: emailHash },
        { name: 'state', op: '!=', val: 'DELETED' },
      ],
      ITEM_PROJECTION,
    );
  }

  public async byWalletAddress(platformCode: string, ownerAddress: string): Promise<ProjectedItemEntity[]> {
    logger.debug(`getItemsByWalletAddress - platformCode = '${platformCode}' ownerAddress = '${ownerAddress}'`)

    return await findEntities(
      ItemRepository.context,
      'item',
      [
        { name: 'platformCode', op: '=', val: platformCode },
        { name: 'ownerAddress', op: '=', val: ownerAddress },
        { name: 'nftState', op: '=', val: 'MINTED' },
        { name: 'state', op: '!=', val: 'DELETED' },
      ],
      ITEM_PROJECTION,
    );
  }

  public async byUser(platformCode: string, user: string): Promise<ProjectedItemEntity[]> {
    logger.debug(`byUser - platformCode = '${platformCode}' user = '${user}'`)

    return await findEntities(
      ItemRepository.context,
      'item',
      [
        { name: 'platformCode', op: '=', val: platformCode },
        { name: 'user', op: '=', val: user },
        { name: 'state', op: '!=', val: 'DELETED' },
      ],
      ITEM_PROJECTION,
    );
  }

  public async byThumbprint(platformCode: string, thumbprint: string): Promise<ProjectedItemEntity | null> {
    logger.debug(`byThumbprint - platformCode = '${platformCode}' thumbprint = '${thumbprint}'`)

    const item: ProjectedItemEntity = await getEntity(ItemRepository.context, 'item', thumbprint);

    if (item && item.platformCode === platformCode && item.state !== 'DELETED') {
      return item;
    } else {
      return null;
    }
  }

  public async insertItem(item: ItemEntity, context?: DatastoreContext): Promise<void> {
    logger.debug(`insertItem - itemCode = '${item.key}' platformCode = '${item.platformCode}'`);

    await insertEntity(context ?? ItemRepository.context, 'item', item);
  }

  public async insertAudit(audit: AuditEntity, context?: DatastoreContext): Promise<void> {
    logger.debug(`insertAudit - entityId = '${audit.entityId}' toState = '${audit.toState}'`);

    await insertEntity(context ?? ItemRepository.context, 'audit', audit);
  }

}
