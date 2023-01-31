import { ItemDto, ItemNftState, ItemSource } from '../dto/item.dto';
import { ProjectedItemEntity } from "../entity/item.entity";

export abstract class AbstractItemMapper<T extends ItemDto, E extends ProjectedItemEntity = ProjectedItemEntity> {

  public toDto(entity: E): T {

    const baseDto: ItemDto = this.toBaseDto(entity);

    return this.toDtoFromBaseDto(entity, baseDto);

  }

  protected abstract toDtoFromBaseDto(entity: E, baseDto: ItemDto): T;

  private toBaseDto(entity: ProjectedItemEntity): ItemDto {

    return {
      brand: entity.brandCode,
      created: entity.created instanceof Date ? entity.created.toISOString() : new Date(entity.created / 1000).toISOString(),
      description: entity.description,
      giveaway: entity.claimCode,
      issue: entity.saleQty,
      maximum: entity.maxQty,
      name: entity.stockKeepingUnitName,
      nftState: ItemNftState[entity.nftState],
      platform: entity.platformCode,
      rarity: entity.stockKeepingUnitRarity,
      rrp: entity.recommendedRetailPrice,
      sku: entity.stockKeepingUnitCode,
      source: ItemSource[entity.source],
      tier: entity.tier,
      token: entity.key,
      version: entity.version,
    };

  }

}
