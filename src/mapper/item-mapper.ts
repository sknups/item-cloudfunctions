import { InternalItemDto } from '../dto/internal/item-internal.dto';
import { InternalItemMediaDto, InternalItemMediaTypeDto } from '../dto/internal/item-media-internal.dto';
import { LegacyRetailerItemDto, RetailerItemDto } from '../dto/retailer/item-retailer.dto';
import { ItemDto, ItemNftState, ItemSource } from '../dto/item.dto';
import { ItemEntity, ProjectedItemEntity } from "../entity/item.entity";
import { parseCard, parseMedia } from './item-media-json-parser';
import { ItemMediaDTOMapper } from "./item-media-mapper";

function _convertLegacyCardJsonToMedia(cardJson: string): InternalItemMediaDto | null {
  if (!cardJson) {
    return null;
  }

  const card = parseCard(cardJson);

  return {
    primary: {
      type: InternalItemMediaTypeDto.DYNAMIC,
      labels: card.front || [],
    },
    secondary: [{
      type: InternalItemMediaTypeDto.DYNAMIC,
      labels: card.back || [],
    }]
  };
}

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

    const media: InternalItemMediaDto | null = parseMedia(entity.media) || _convertLegacyCardJsonToMedia(entity.card);

    return {
      ...dto,
      cardJson: entity.card,
      nftAddress: entity.nftAddress,
      ownerAddress: entity.ownerAddress,
      media,
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
