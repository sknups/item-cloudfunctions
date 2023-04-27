import { ItemEvent, ItemEventType } from '../eventstreaming/item-event';
import { ItemEntity } from '../entity/item.entity';
import { AuditEntity } from '../entity/audit.entity';
import { Sku } from '../client/catalog/catalog.client';

export function skuToItemEntity(
  sku: Sku,
  skuCode: string,
  ownershipToken: string,
  claimCode: string | null,
  issued: number | null,
  issue: number | null,
  user: string,
): ItemEntity {
  const created = new Date();
  return {
    key: ownershipToken,
    brandCode: sku.brandCode,
    brandName: sku.brandName,
    brandWholesalePrice: sku.brandWholesalePrice,
    brandWholesalerShare: sku.brandWholesalerShare,
    card: sku.card,
    claimCode: claimCode,
    created,
    description: sku.description,
    user: user || null,
    maxQty: sku.maxQty,
    nftAddress: null,
    nftState: 'UNMINTED',
    ownerAddress: null,
    platformCode: sku.platformCode,
    recommendedRetailPrice: sku.recommendedRetailPrice,
    issued: issued,
    issue: issue,
    source: (claimCode !== null || sku.claimable) ? 'GIVEAWAY' : 'SALE',
    state: 'UNBOXED',
    stockKeepingUnitCode: skuCode,
    stockKeepingUnitName: sku.name,
    stockKeepingUnitRarity: sku.rarity,
    tier: sku.tier,
    updated: created,
    version: sku.version,
    skn: sku.skn,
    media: sku.media || null
  }
}

export function itemEntityToItemEvent(item: ItemEntity, audit: AuditEntity, eventId: string, eventType: ItemEventType): ItemEvent {
  const event = new ItemEvent();
  event.brandCode = item.brandCode;
  event.brandName = item.brandName;
  event.brandWholesalePrice = item.brandWholesalePrice;
  event.brandWholesalerShare = item.brandWholesalerShare;
  event.claimCode = item.claimCode;
  event.dataEvent = ItemEventType[eventType];
  event.dataTimestamp = audit.date;
  event.eventId = eventId;
  event.itemCode = audit.entityId;
  event.maxQty = item.maxQty;
  event.nftAddress = item.nftAddress;
  event.nftState = item.nftState;
  event.ownerAddress = item.ownerAddress;
  event.platformCode = item.platformCode;
  event.retailSource = 'FirebaseUID';
  event.retailUserId = item.user;
  event.rrp = item.recommendedRetailPrice;
  event.saleQty = item.issued;
  event.skuCode = item.stockKeepingUnitCode;
  event.skuName = item.stockKeepingUnitName;
  event.source = item.source;
  event.state = item.state;
  return event;
}
