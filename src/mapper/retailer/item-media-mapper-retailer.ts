import { PrimaryMediaDto } from '../../dto/retailer/item-media-retailer-primary.dto';
import { SecondaryMediaDto } from '../../dto/retailer/item-media-retailer-secondary.dto';
import { RetailerItemMediaDto, RetailerItemMediaTypeDto, ImageMediaUrlsDto, VideoMediaUrlsDto } from '../../dto/retailer/item-media-retailer.dto';
import { ItemEntity } from '../../entity/item.entity';
import { parseMedia } from '../item-media-json-parser';
import { InternalItemMediaDto, InternalItemMediaTypeDto } from '../../dto/internal/item-media-internal.dto';

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

function _legacySknToMedia(entity: ItemEntity): InternalItemMediaDto {
  const supportedSkn: string[] = [
    InternalItemMediaTypeDto.DYNAMIC.toString(),
    InternalItemMediaTypeDto.VIDEO.toString(),
  ];

  if (!supportedSkn.includes(entity.skn)) {
    throw new Error(`Unsupported legacy skn value '${entity.skn}' supported values: ${supportedSkn}`);
  }

  return {
    primary: {
      type: InternalItemMediaTypeDto[entity.skn],
    },
    secondary: [{
      type: InternalItemMediaTypeDto.DYNAMIC,
    }],
  };
}

export class ItemMediaDTOMapper {

  constructor(
    private readonly assetsHost: string,
    private readonly flexHost: string,
  ) { }

  toDTO(entity: ItemEntity): RetailerItemMediaDto {
    // Use entity.media if available (v3+) otherwise convert skn property to media (v1,v2)
    const media: InternalItemMediaDto = parseMedia(entity.media) || _legacySknToMedia(entity);

    return {
      primary: this.mapPrimaryMedia(media.primary.type, entity),
      secondary: media.secondary.map((s, i) => this.mapSecondaryMedia(s.type, entity, i, s.link)),
      social: {
        default: {
          image: _getImageBlock(`${this.flexHost}/skn/v1/primary/og/${entity.key}`),
        },
        snapchat: {
          image: _getImageBlock(`${this.flexHost}/skn/v1/primary/snapsticker/${entity.key}`),
        },
      },
      model: {
        config: `${this.assetsHost}/sku.v1.3DConfig.${entity.stockKeepingUnitCode}.json`,
        glb: `${this.assetsHost}/sku.v1.3DView.${entity.stockKeepingUnitCode}.glb`,
      },
    };

  }

  private mapMedia(type: InternalItemMediaTypeDto, item: ItemEntity, suffix: string): PrimaryMediaDto {
    const flexSuffix = suffix.replace('.', '/') + '/default';

    switch (type) {
      case InternalItemMediaTypeDto.STATIC:
        return {
          type: RetailerItemMediaTypeDto.IMAGE,
          image: _getImageBlock(`${this.assetsHost}/sku.${item.stockKeepingUnitCode}.${suffix}`),
        };
      case InternalItemMediaTypeDto.DYNAMIC:
        return {
          type: RetailerItemMediaTypeDto.IMAGE,
          image: _getImageBlock(`${this.flexHost}/skn/v1/${flexSuffix}/${item.key}`),
        };
      case InternalItemMediaTypeDto.VIDEO:
        return {
          type: RetailerItemMediaTypeDto.VIDEO,
          image: _getImageBlock(`${this.assetsHost}/sku.${item.stockKeepingUnitCode}.${suffix}`),
          video: _getVideoBlock(`${this.assetsHost}/sku.${item.stockKeepingUnitCode}.${suffix}`),
        };
      default:
        // Should never happen unles a new type is introduced into ItemEntityMediaType without a case statement above
        throw new Error(`unsupported media type '${type}'`);
    }
  }

  private mapPrimaryMedia(type: InternalItemMediaTypeDto, item: ItemEntity): PrimaryMediaDto {
    return this.mapMedia(type, item, 'primary');
  }

  private mapSecondaryMedia(type: InternalItemMediaTypeDto, item: ItemEntity, index: number, link?: string): SecondaryMediaDto {
    const media = this.mapMedia(type, item, `secondary.${index}`);

    return {
      ...media,
      link,
    };
  }



}
