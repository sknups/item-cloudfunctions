import { ItemDto } from '../../dto/item.dto';
import { LegacyRetailerItemDto } from '../../dto/retailer/item-retailer.dto';
import { ProjectedItemEntity } from '../../entity/item.entity';
import { AbstractItemMapper } from '../item-mapper';
import { ItemMediaDTOMapper } from './item-media-mapper-retailer';

export class RetailerItemMapper extends AbstractItemMapper<LegacyRetailerItemDto> {

  private mediaMapper: ItemMediaDTOMapper;

  constructor(
    assetsHost: string,
    private readonly flexHost: string,
    private readonly sknappHost: string
  ) {
    super();
    this.mediaMapper = new ItemMediaDTOMapper(assetsHost, flexHost);
  }

  protected toDtoFromBaseDto(entity: ProjectedItemEntity, baseDto: ItemDto): LegacyRetailerItemDto {

    return {
      ...baseDto,
      media: this.mediaMapper.toDTO(entity),
      brandCode: baseDto.brand,
      certVersion: 'v1',
      claimCode: baseDto.giveaway,
      flexHost: this.flexHost,
      maxQty: baseDto.maximum,
      platformCode: baseDto.platform,
      recommendedRetailPrice: baseDto.rrp,
      saleQty: baseDto.issue,
      sknappHost: this.sknappHost,
      stockKeepingUnitCode: baseDto.sku,
      thumbprint: baseDto.token,
    };

  }

}
