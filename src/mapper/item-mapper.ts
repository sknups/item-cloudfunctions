import { ItemDto, LegacyItemDto, ItemNftState, ItemSource } from '../dto/item.dto';
import { ProjectedItemEntity } from "../entity/item.entity";
import { ItemMediaDTOMapper } from "./item-media-mapper";

export class ItemDTOMapper {

  private mediaMapper: ItemMediaDTOMapper;

  private flexHost: string;

  private sknappHost: string;

  constructor(
    assetsHost: string,
    flexHost: string,
    sknappHost: string
  ) {
    this.mediaMapper = new ItemMediaDTOMapper(assetsHost);
    this.flexHost = flexHost;
    this.sknappHost = sknappHost;
  }

  toDTO(entity: ProjectedItemEntity): LegacyItemDto {

    const certVersion = 'v1';

    const media = this.mediaMapper.toDTO(
      this.flexHost,
      entity.stockKeepingUnitCode,
      entity.skn,
      entity.key,
    );

    const dto: ItemDto = {
      brand: entity.brandCode,
      cardJson: entity.card,
      created: entity.created instanceof Date ? entity.created.toISOString() : new Date(entity.created / 1000).toISOString(),
      description: entity.description,
      giveaway: entity.claimCode,
      issue: entity.saleQty,
      maximum: entity.maxQty,
      media,
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

    return {
      ...dto,
      brandCode: dto.brand,
      certVersion,
      claimCode: dto.giveaway,
      flexHost: this.flexHost,
      maxQty: dto.maximum,
      platformCode: dto.platform,
      recommendedRetailPrice: dto.rrp,
      saleQty: dto.issue,
      sknappHost: this.sknappHost,
      stockKeepingUnitCode: dto.sku,
      thumbprint: dto.token,
    };

  }
}
