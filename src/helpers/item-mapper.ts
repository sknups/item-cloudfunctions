import { AllConfig } from '../config/all-config';
import { ItemEvent } from '../eventstreaming/item-event';
import { AuditEntity } from '../persistence/audit-entity';
import { ItemEntity } from '../persistence/item-entity';
import { SkuEntity } from '../persistence/sku-entity';
import { createHash } from 'crypto';
import { CreateNonEnumeratedItemResponseDTO } from '../dto/create-non-enumerated-item-response.dto';

export function skuEntityToItemEntity(
  sku: SkuEntity,
  skuCode: string,
  claimCode: string,
  email: string,
  user: string,
  cfg: AllConfig,
): ItemEntity {
  const item = new ItemEntity();
  item.brandCode = sku.brandCode;
  item.brandName = sku.brandName;
  item.brandWholesalePrice = sku.brandWholesalePrice;
  item.brandWholesalerShare = sku.brandWholesalerShare;
  item.card = sku.card;
  item.certVersion = 'v1';
  item.claimCode = claimCode;
  item.created = new Date();
  item.description = sku.description;
  item.emailHash = createHash('sha256').update(cfg.emailHashingSecret + email).digest('hex');
  item.user = user || null;
  item.flexHost = cfg.flexUrl;
  item.maxQty = sku.maxQty;
  item.nftAddress = null;
  item.nftState = 'UNMINTED';
  item.ownerAddress = null;
  item.platformCode = sku.platformCode;
  item.recommendedRetailPrice = sku.recommendedRetailPrice;
  item.saleQty = null;
  item.sknappHost = cfg.sknAppUrl;
  item.source = 'GIVEAWAY';
  item.state = 'UNBOXED';
  item.stockKeepingUnitCode = skuCode;
  item.stockKeepingUnitName = sku.name;
  item.stockKeepingUnitRarity = sku.rarity;
  item.tier = sku.tier;
  item.updated = item.created;
  item.version = '2';
  item.skn = sku.skn;
  return item;
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

export function itemEntityToResponseDto(item: ItemEntity, itemCode: string): CreateNonEnumeratedItemResponseDTO {
  return {
    brandCode: item.brandCode,
    brandName: item.brandName,
    card: item.card,
    certVersion: item.certVersion,
    claimCode: item.claimCode,
    code: itemCode,
    description: item.description,
    flexHost: item.flexHost,
    maxQty: item.maxQty,
    nftAddress: item.nftAddress,
    nftState: item.nftState,
    ownerAddress: item.ownerAddress,
    platformCode: item.platformCode,
    recommendedRetailPrice: item.recommendedRetailPrice,
    saleQty: item.saleQty,
    sknappHost: item.sknappHost,
    source: item.source,
    state: item.state,
    stockKeepingUnitCode: item.stockKeepingUnitCode,
    stockKeepingUnitName: item.stockKeepingUnitName,
    stockKeepingUnitRarity: item.stockKeepingUnitRarity,
    thumbprint: itemCode,
    version: item.version,
  }
}
