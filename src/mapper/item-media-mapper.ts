import { PrimaryMediaDto } from '../dto/item-media-primary.dto';
import { SecondaryMediaDto } from '../dto/item-media-secondary.dto';
import { ImageMediaUrlsDto, ItemMediaTypeDto, VideoMediaUrlsDto } from '../dto/item-media-type.dto';
import { ItemMediaDto } from '../dto/item-media.dto';
import { ProjectedItemEntity } from '../entity/item.entity';
import { ItemEntityMedia, ItemEntityMediaType, parseMedia } from './item-media-json-parser';

function _getImageBlock(baseUrl: string): ImageMediaUrlsDto {
  return {
    jpeg: `${baseUrl}.jpg`,
    png: `${baseUrl}.png`,
    webp: `${baseUrl}.webp`,
  }
}

function _getVideoBlock(baseUrl: string): VideoMediaUrlsDto {
  return {
    mp4: `${baseUrl}.mp4`,
  }
}

function _legacySknToMedia(entity: ProjectedItemEntity): ItemEntityMedia {
  const supportedSkn: string[] = [
    ItemEntityMediaType.DYNAMIC.toString(),
    ItemEntityMediaType.VIDEO.toString(),
  ];

  if (!supportedSkn.includes(entity.skn)) {
    throw new Error(`Unsupported legacy skn value '${entity.skn}' supported vaues: ${supportedSkn}`);
  }

  return {
    primary: {
      type: ItemEntityMediaType[entity.skn],
    },
    secondary: [{
      type: ItemEntityMediaType.DYNAMIC,
    }],
  };
}

export class ItemMediaDTOMapper {

  constructor(
    private readonly assetsHost: string,
    private readonly flexHost: string,
  ) { }

  toDTO(entity: ProjectedItemEntity): ItemMediaDto {
    // Use entity.media if available (v3+) otherwise convert skn property to media (v1,v2)
    const media: ItemEntityMedia = parseMedia(entity.media) || _legacySknToMedia(entity);

    return {
      primary: this.mapPrimaryMedia(media.primary.type, entity),
      secondary: media.secondary.map((s, i) => this.mapSecondaryMedia(s.type, entity, i, s.link)),
      social: {
        default: {
          image: _getImageBlock(`${this.flexHost}/skn/v1/card/og/${entity.key}`),
        },
        snapchat: {
          image: _getImageBlock(`${this.flexHost}/skn/v1/card/snapchat/${entity.key}`),
        },
      },
      model: {
        config: `${this.assetsHost}/sku.v1.3DConfig.${entity.stockKeepingUnitCode}.json`,
        glb: `${this.assetsHost}/sku.v1.3DView.${entity.stockKeepingUnitCode}.glb`,
      },
    };

  }

  private mapMedia(type: ItemEntityMediaType, item: ProjectedItemEntity, suffix: string): PrimaryMediaDto {
    const flexSuffix = suffix.replace('.', '/');

    switch (type) {
      case ItemEntityMediaType.STATIC:
        return {
          type: ItemMediaTypeDto.IMAGE,
          image: _getImageBlock(`${this.assetsHost}/sku.${item.stockKeepingUnitCode}.${suffix}`),
        };
      case ItemEntityMediaType.DYNAMIC:
        return {
          type: ItemMediaTypeDto.IMAGE,
          image: _getImageBlock(`${this.flexHost}/skn/v1/${flexSuffix}/${item.key}`),
        };
      case ItemEntityMediaType.VIDEO:
        return {
          type: ItemMediaTypeDto.VIDEO,
          image: _getImageBlock(`${this.assetsHost}/sku.${item.stockKeepingUnitCode}.${suffix}`),
          video: _getVideoBlock(`${this.assetsHost}/sku.${item.stockKeepingUnitCode}.${suffix}`),
        };
      default:
        // Should never happen unles a new type is introduced into ItemEntityMediaType without a case statement above
        throw new Error(`unsupported media type '${type}'`);
    }
  }

  private mapPrimaryMedia(type: ItemEntityMediaType, item: ProjectedItemEntity): PrimaryMediaDto {
    return this.mapMedia(type, item, 'primary');
  }

  private mapSecondaryMedia(type: ItemEntityMediaType, item: ProjectedItemEntity, index: number, link?: string): SecondaryMediaDto {
    const media = this.mapMedia(type, item, `secondary.${index}`);

    return {
      ...media,
      link,
    };
  }



}
