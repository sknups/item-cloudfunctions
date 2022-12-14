import { Datastore } from '@google-cloud/datastore';
import { Filter } from '@google-cloud/datastore/build/src/query';
import { plainToClass } from 'class-transformer';
import logger from '../helpers/logger';
import { ItemEntityData } from './item-entity';

export class ItemRepository {

  public static datastore = new Datastore({ namespace: 'drm' });

  public async byEmailHash(platformCode: string, emailHash: string): Promise<ItemEntityData[]> {
    logger.debug(`getItemsByEmailHash - platformCode = '${platformCode}' emailHash = '${emailHash}'`)
    return this._getItems([
      { name: 'platformCode', op: '=', val: platformCode },
      { name: 'emailHash', op: '=', val: emailHash },
      { name: 'state', op: '!=', val: 'DELETED'}
    ]);
  }

  public async byWalletAddress(platformCode: string, ownerAddress: string): Promise<ItemEntityData[]> {
    logger.debug(`getItemsByWalletAddress - platformCode = '${platformCode}' ownerAddress = '${ownerAddress}'`)
    return this._getItems([
      { name: 'platformCode', op: '=', val: platformCode },
      { name: 'ownerAddress', op: '=', val: ownerAddress },
      { name: 'nftState', op: '=', val: 'MINTED' },
      { name: 'state', op: '!=', val: 'DELETED'}
    ]);
  }

  public async byUser(platformCode: string, user: string): Promise<ItemEntityData[]> {
    logger.debug(`byUser - platformCode = '${platformCode}' user = '${user}'`)
    return this._getItems([
      { name: 'platformCode', op: '=', val: platformCode },
      { name: 'user', op: '=', val: user },
      { name: 'state', op: '!=', val: 'DELETED'}
    ]);
  }

  public async byThumbprint(platformCode: string, thumbprint: string): Promise<ItemEntityData|null> {
    logger.debug(`byThumbprint - platformCode = '${platformCode}' thumbprint = '${thumbprint}'`)

    const key = ItemRepository.datastore.key(['item', thumbprint]);

    const items = await this._getItems([
      { name: '__key__', op: '=', val: key },
      { name: 'platformCode', op: '=', val: platformCode },
      { name: 'state', op: '!=', val: 'DELETED'}
    ]);

    if (items.length === 1) {
      return items[0];
    }

    return null;
  }

  

  private async _getItems(filters: Filter[]): Promise<ItemEntityData[]> {

    const projection = [
      'brandCode',
      'card',      
      'claimCode',
      'created',
      'description',
      'emailHash',
      'maxQty',
      'nftState',
      'ownerAddress',
      'platformCode',
      'recommendedRetailPrice',
      'saleQty',
      'skn',      
      'source',
      'stockKeepingUnitCode',
      'stockKeepingUnitName',
      'stockKeepingUnitRarity',
      'tier',
      'user',
      'version'
    ].filter(p => !filters.find(filter => p === filter.name));

    const query = ItemRepository.datastore
      .createQuery('item')
      .select(projection);

    query.filters = filters;

    const [items] = await ItemRepository.datastore.runQuery(query);

    return items.map((result) => {
      const item = plainToClass(ItemEntityData, result)
      item.thumbprint = result[Datastore.KEY].name
      filters.forEach(filter => {
        if (Object.prototype.hasOwnProperty.call(item, filter.name)) {
          item[filter.name] = filter.val
        }
      })
      return item;
    })
  }
}
