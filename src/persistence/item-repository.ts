import { AuditEntity } from '../entity/audit.entity';
import { ItemEntity } from '../entity/item.entity';
import { countEntities, createContext, DatastoreContext, findEntities, getEntity, insertEntity, updateEntity } from '../helpers/datastore/datastore.helper';
import logger from '../helpers/logger';

export class ItemRepository {

  public static context = createContext('drm');

  public async byWalletAddress(platformCode: string, ownerAddress: string): Promise<ItemEntity[]> {
    logger.debug(`getItemsByWalletAddress - platformCode = '${platformCode}' ownerAddress = '${ownerAddress}'`)

    const items = await findEntities<ItemEntity>(
      ItemRepository.context,
      'item',
      [
        { name: 'platformCode', op: '=', val: platformCode },
        { name: 'ownerAddress', op: '=', val: ownerAddress },
      ],
    ).then(items => items.filter(item => item.state !== 'DELETED' && item.nftState === 'MINTED'));
   
    return items;
  }

  public async byUser(platformCode: string, user: string): Promise<ItemEntity[]> {
    logger.debug(`byUser - platformCode = '${platformCode}' user = '${user}'`)

    const items = await findEntities<ItemEntity>(
      ItemRepository.context,
      'item',
      [
        { name: 'platformCode', op: '=', val: platformCode },
        { name: 'user', op: '=', val: user },
      ],
    ).then(items => items.filter(item => item.state !== 'DELETED'));

    return items;
  }

  public async bySkuAndUser(sku: string, user: string): Promise<ItemEntity[]> {
    logger.debug(`bySkuAndUser - sku = '${sku}' user = '${user}'`)
    
    const items = await findEntities<ItemEntity>(
      ItemRepository.context,
      'item',
      [
        { name: 'stockKeepingUnitCode', op: '=', val: sku },
        { name: 'user', op: '=', val: user },
      ],
    ).then(items => items.filter(item => item.state !== 'DELETED'));

    return items;
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

  public async findLastIssued(platform: string, sku: string, context?: DatastoreContext): Promise<ItemEntity | null> {
    logger.debug(`findLastIssued - platform = '${platform} sku = '${sku}''`)

    const items: ItemEntity[] = await findEntities(
      context ?? ItemRepository.context,
      'item',
      [
        { name: 'platformCode', op: '=', val: platform },
        { name: 'stockKeepingUnitCode', op: '=', val: sku },
        { name: 'issued', op: '!=', val: null }
      ],
      [{ name: 'issued', sign: '-'}]
    );

    return items.length > 0 ? items[0] : null;
  }

  public async countClaimed(platform: string, sku: string, context?: DatastoreContext): Promise<number> {
    logger.debug(`countClaimed - platform = '${platform} sku = '${sku}''`)

    return await countEntities(
      context ?? ItemRepository.context,
      'item',
      [
        { name: 'platformCode', op: '=', val: platform },
        { name: 'stockKeepingUnitCode', op: '=', val: sku },
        { name: 'claimCode', op: '!=', val: null }
      ],
    );
  }

  public async countPurchased(platform: string, sku: string, context?: DatastoreContext): Promise<number> {
    logger.debug(`countPurchased - platform = '${platform} sku = '${sku}''`)

    return await countEntities(
      context ?? ItemRepository.context,
      'item',
      [
        { name: 'platformCode', op: '=', val: platform },
        { name: 'stockKeepingUnitCode', op: '=', val: sku },
        { name: 'claimCode', op: '=', val: null }
      ],
    );
  }

  public async insertItem(item: ItemEntity, context?: DatastoreContext): Promise<void> {
    logger.debug(`insertItem - ownershipToken = '${item.key}' platformCode = '${item.platformCode}'`);

    await insertEntity(context ?? ItemRepository.context, 'item', item, this._excludeFromIndexes());
  }

  public async updateItem(item: ItemEntity, context: DatastoreContext): Promise<void> {
    logger.debug(`updateItem - ownershipToken = '${item.key}' platformCode = '${item.platformCode}'`);

    await updateEntity(context, 'item', item, this._excludeFromIndexes());
  }

  public async insertAudit(audit: AuditEntity, context: DatastoreContext): Promise<void> {
    logger.debug(`insertAudit - entityId = '${audit.entityId}' toState = '${audit.toState}'`);

    await insertEntity(context, 'audit', audit);
  }

  private _excludeFromIndexes() : string[] {
    return ['brandName','description','stockKeepingUnitName','media']
  }

}
