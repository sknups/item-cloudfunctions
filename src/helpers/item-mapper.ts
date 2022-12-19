import { AllConfig } from '../config/all-config';
import { ItemEvent } from '../eventstreaming/item-event';
import { SkuEntity } from '../persistence/sku-entity';
import { ItemEntity } from '../entity/item.entity';
import { AuditEntity } from '../entity/audit.entity';
import { hashEmail } from '../hashing/index';

export function skuEntityToItemEntity(
  sku: SkuEntity,
  skuCode: string,
  itemCode: string,
  claimCode: string,
  email: string,
  user: string,
  cfg: AllConfig,
): ItemEntity {
  const created = new Date();
  return {
    key: itemCode,
    brandCode: sku.brandCode,
    brandName: sku.brandName,
    brandWholesalePrice: sku.brandWholesalePrice,
    brandWholesalerShare: sku.brandWholesalerShare,
    card: sku.card,
    certVersion: 'v1',
    claimCode: claimCode,
    created,
    description: sku.description,
    emailHash: hashEmail(email, cfg.emailHashingSecret),
    user: user || null,
    flexHost: cfg.flexUrl,
    maxQty: sku.maxQty,
    nftAddress: null,
    nftState: 'UNMINTED',
    ownerAddress: null,
    platformCode: sku.platformCode,
    recommendedRetailPrice: sku.recommendedRetailPrice,
    saleQty: null,
    sknappHost: cfg.sknAppUrl,
    source: 'GIVEAWAY',
    state: 'UNBOXED',
    stockKeepingUnitCode: skuCode,
    stockKeepingUnitName: sku.name,
    stockKeepingUnitRarity: sku.rarity,
    tier: sku.tier,
    updated: created,
    version: '2',
    skn: sku.skn,
  }
}

export function itemEntityToCreateItemEvent(item: ItemEntity, audit: AuditEntity, eventId: string): ItemEvent {
  const event = new ItemEvent();
  event.brandCode = item.brandCode;
  event.brandName = item.brandName;
  event.brandWholesalePrice = item.brandWholesalePrice;
  event.brandWholesalerShare = item.brandWholesalerShare;
  event.claimCode = item.claimCode;
  event.dataEvent = 'CREATE';
  event.dataTimestamp = audit.date;
  event.eventId = eventId;
  event.itemCode = audit.entityId;
  event.maxQty = item.maxQty;
  event.nftAddress = item.nftAddress;
  event.nftState = item.nftState;
  event.ownerAddress = item.ownerAddress;
  event.platformCode = item.platformCode;
  event.retailSource = item.user == null ? 'sknups.gg-emailhash' : 'FirebaseUID';
  event.retailUserId = item.user == null ? item.emailHash : item.user;
  event.rrp = item.recommendedRetailPrice;
  event.saleQty = item.saleQty;
  event.skuCode = item.stockKeepingUnitCode;
  event.skuName = item.stockKeepingUnitName;
  event.skuRarity = item.stockKeepingUnitRarity;
  event.source = item.source;
  event.state = item.state;
  event.tier = item.tier;
  return event;
}
