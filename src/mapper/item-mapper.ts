import { ItemDto, ItemNftState, ItemSource } from '../dto/item.dto';
import { ItemEntity } from "../entity/item.entity";

export abstract class AbstractItemMapper<T extends ItemDto> {

  public toDto(entity: ItemEntity): T {

    const baseDto: ItemDto = this.toBaseDto(entity);

    return this.toDtoFromBaseDto(entity, baseDto);

  }

  protected abstract toDtoFromBaseDto(entity: ItemEntity, baseDto: ItemDto): T;

  private toBaseDto(entity: ItemEntity): ItemDto {

    return {
      brand: entity.brandCode,
      created: entity.created instanceof Date ? entity.created.toISOString() : new Date(entity.created / 1000).toISOString(),
      description: entity.description,
      giveaway: entity.claimCode,
      issue: this.getIssueNumber(entity),
      maximum: this.getMaximumNumber(entity),
      name: entity.stockKeepingUnitName,
      nftState: ItemNftState[entity.nftState],
      platform: entity.platformCode,
      rrp: entity.recommendedRetailPrice,
      sku: entity.stockKeepingUnitCode,
      source: ItemSource[entity.source],
      tier: entity.tier,
      token: entity.key,
      version: entity.version,
    };

  }

  private getIssueNumber(entity: ItemEntity): number | null {
    switch (entity.version) {
      case "1":
        return entity.stockKeepingUnitRarity === 0? null : entity.saleQty;
      case "2":
        return entity.card && entity.card.includes("${issue}") ? entity.saleQty : null;
      case "3":
        return entity.media && entity.media.includes("${issue}") ? entity.saleQty : null;
    }
  }

  private getMaximumNumber(entity: ItemEntity): number | null {
    switch (entity.version) {
      case "1":
        return entity.stockKeepingUnitRarity === 0 || entity.stockKeepingUnitRarity === 1? null : entity.maxQty;
      case "2":
        return entity.card && entity.card.includes("${maximum}") ? entity.maxQty : null;
      case "3":
        return entity.media && entity.media.includes("${maximum}") ? entity.maxQty : null;
    }
  }

}
