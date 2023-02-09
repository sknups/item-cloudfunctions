import { ItemDto } from '../../dto/item.dto';
import { RetailerItemDto } from '../../dto/retailer/item-retailer.dto';
import { ItemEntity } from '../../entity/item.entity';
import { AbstractItemMapper } from '../item-mapper';
import { ItemMediaDTOMapper } from './item-media-mapper-retailer';

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

    return {
      ...baseDto,
      media: this.mediaMapper.toDTO(entity),
    };

  }

}
