import { InternalItemDto } from '../dto/item-internal.dto';
import { LegacyRetailerItemDto, RetailerItemDto } from '../dto/item-retailer.dto';
import { ItemDto, ItemNftState, ItemSource } from '../dto/item.dto';
import { ItemEntity, ProjectedItemEntity } from "../entity/item.entity";
import { ItemMediaDTOMapper } from "./item-media-mapper";

export class ItemDTOMapper {

  private mediaMapper: ItemMediaDTOMapper;

  constructor(
    assetsHost: string,
    private readonly flexHost: string,
    private readonly sknappHost: string
  ) {
    this.mediaMapper = new ItemMediaDTOMapper(assetsHost, flexHost);
  }

  toInternalDto(entity: ItemEntity): InternalItemDto {

    const dto = this.toBaseDto(entity);

    return {
      ...dto,
      cardJson: entity.card,
      nftAddress: entity.nftAddress,
      ownerAddress: entity.ownerAddress,
      media: entity.media
    }

  }

  toRetailerDto(entity: ProjectedItemEntity): LegacyRetailerItemDto {
    const baseDto: ItemDto = this.toBaseDto(entity);

    const dto: RetailerItemDto = {
      ...baseDto,
      media: this.mediaMapper.toDTO(entity),
    }

    return {
      ...dto,
      brandCode: dto.brand,
      certVersion: 'v1',
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

  private toBaseDto(entity: ProjectedItemEntity): ItemDto {

    const dto: ItemDto = {
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

    return dto;

  }

}
