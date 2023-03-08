import { ItemDto, ItemNftState, ItemSource } from '../dto/item.dto';
import { ItemEntity } from '../entity/item.entity';

interface ItemEnumeration {
  issue: number | null,
  maximum: number | null,
}

export abstract class AbstractItemMapper<T extends ItemDto> {

  public toDto(entity: ItemEntity): T {

    const baseDto: ItemDto = this.toBaseDto(entity);

    return this.toDtoFromBaseDto(entity, baseDto);

  }

  protected abstract toDtoFromBaseDto(entity: ItemEntity, baseDto: ItemDto): T;

  private toBaseDto(entity: ItemEntity): ItemDto {
    const itemEnumeration: ItemEnumeration = this.setItemEnumerationVisibility(entity);
    return {
      brand: entity.brandCode,
      created: entity.created instanceof Date ? entity.created.toISOString() : new Date(entity.created / 1000).toISOString(),
      description: entity.description,
      giveaway: entity.claimCode,
      issue: itemEnumeration.issue,
      maximum: itemEnumeration.maximum,
      name: entity.stockKeepingUnitName,
      nftState: ItemNftState[entity.nftState],
      platform: entity.platformCode,
      sku: entity.stockKeepingUnitCode,
      source: ItemSource[entity.source],
      tier: entity.tier,
      token: entity.key,
      version: entity.version,
    };
  }

  /**
   * @param {ItemEntity} item in datastore
   * @returns {ItemEnumeration} how a retailer should visualise an item's enumeration
   */
  private setItemEnumerationVisibility(item: ItemEntity): ItemEnumeration {
    let issue: number | null;
    let maximum: number | null;

    if (item.stockKeepingUnitRarity) {
      // If rarity exists, we are in v1 item
      issue = item.stockKeepingUnitRarity === 0 ? null : item.saleQty;
      maximum = item.stockKeepingUnitRarity === 0 || item.stockKeepingUnitRarity === 1? null : item.maxQty;

    } else if (item.card) {
      // If card exists, we are in a v2 item
      issue = item.card && item.card.includes("${issue}") ? item.saleQty : null;
      maximum = item.card && item.card.includes("${maximum}") ? item.maxQty : null;

    } else {
      // If the above aren't true, we are in a v3+ item
      issue = item.media && item.media.includes("${issue}") ? item.saleQty : null;
      maximum = item.media && item.media.includes("${maximum}") ? item.maxQty : null;
    }

    return { issue, maximum };
  }

}
