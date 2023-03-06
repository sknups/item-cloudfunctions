import { InternalItemDto } from '../../dto/internal/item-internal.dto';
import { InternalItemMediaDto, InternalItemMediaTypeDto } from '../../dto/internal/item-media-internal.dto';
import { ItemDto } from '../../dto/item.dto';
import { ItemEntity } from '../../entity/item.entity';
import { AbstractItemMapper } from '../item-mapper';
import { parseCard, parseMedia } from '../item-media-json-parser';

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

export class InternalItemMapper extends AbstractItemMapper<InternalItemDto> {

  protected toDtoFromBaseDto(entity: ItemEntity, baseDto: ItemDto): InternalItemDto {

    const media: InternalItemMediaDto | null = parseMedia(entity.media) || _convertLegacyCardJsonToMedia(entity.card);

    return {
      ...baseDto,
      rarity: entity.stockKeepingUnitRarity,
      cardJson: entity.card,
      nftAddress: entity.nftAddress,
      ownerAddress: entity.ownerAddress,
      media,
    }

  }

}
