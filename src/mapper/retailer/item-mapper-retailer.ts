import { ItemDto } from '../../dto/item.dto';
import { RetailerItemDto } from '../../dto/retailer/item-retailer.dto';
import { ItemEntity } from '../../entity/item.entity';
import { AbstractItemMapper } from '../item-mapper';
import { ItemMediaDTOMapper } from './item-media-mapper-retailer';

interface ItemEnumeration {
  issue: number | null,
  maximum: number | null,
}

export class RetailerItemMapper extends AbstractItemMapper<RetailerItemDto> {

  private mediaMapper: ItemMediaDTOMapper;

  constructor(
    assetsHost: string,
    private readonly flexHost: string,
  ) {
    super();
    this.mediaMapper = new ItemMediaDTOMapper(assetsHost, flexHost);
  }

  protected toDtoFromBaseDto(entity: ItemEntity, baseDto: ItemDto): RetailerItemDto {
    const itemEnumeration: ItemEnumeration = this.setItemEnumerationVisibility(entity);

    return {
      ...baseDto,
      issue: itemEnumeration.issue,
      maximum: itemEnumeration.maximum,
      media: this.mediaMapper.toDTO(entity),
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
