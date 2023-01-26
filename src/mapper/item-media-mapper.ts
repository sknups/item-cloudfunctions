import { ImageMediaDto, ItemMediaDto, PrimaryMediaDto, SecondaryMediaDto, VideoMediaDto } from '../dto/item-media.dto';
import { ProjectedItemEntity } from '../entity/item.entity';

function _getImageBlock(baseUrl: string): ImageMediaDto {
  return {
    jpeg: `${baseUrl}.jpg`,
    png: `${baseUrl}.png`,
    webp: `${baseUrl}.webp`,
  }
}

function _getVideoBlock(baseUrl: string): VideoMediaDto {
  return {
    mp4: `${baseUrl}.mp4`,
  }
}

export class ItemMediaDTOMapper {

  constructor(
    private readonly assetsHost: string,
    private readonly flexHost: string,
  ) { }

  toDTO(entity: ProjectedItemEntity): ItemMediaDto {
    let primary: PrimaryMediaDto;
    let secondary: SecondaryMediaDto[];

    if (['1', '2'].includes(entity.version)) {
      [primary, secondary] = this.getMediaFromSkn(entity.stockKeepingUnitCode, entity.skn, entity.key);
    } else {
      [primary, secondary] = this.getMedia(entity.media, entity.stockKeepingUnitCode, entity.key);
    }

    return {
      primary,
      secondary,
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

  private getMedia(mediaJson: string, sku: string, token: string): [PrimaryMediaDto, SecondaryMediaDto[]] {

    const media = JSON.parse(mediaJson);

    let primary: PrimaryMediaDto;
    const secondary: SecondaryMediaDto[] = [];

    switch (media.primary.type) {
      case 'STATIC':
        primary = {
          type: 'IMAGE',
          image: _getImageBlock(`${this.assetsHost}/sku.${sku}.primary`),
        };
        break;
      case 'DYNAMIC':
        primary = {
          type: 'IMAGE',
          image: _getImageBlock(`${this.flexHost}/skn/v1/card/primary/${token}`),
        };
        break;
      case 'VIDEO':
        primary = {
          type: 'VIDEO',
          image: _getImageBlock(`${this.assetsHost}/sku.${sku}.primary`),
          video: _getVideoBlock(`${this.assetsHost}/sku.${sku}.primary`),
        };
        break;
      default:
        throw new Error(`unsupported primary media type '${media.primary.type}'. Must be 'STATIC', 'DYNAMIC' or 'VIDEO'`);
    }

    for (const [i, s] of media.secondary.entries()) {
      switch (s.type) {
        case 'STATIC':
          secondary.push({
            type: 'IMAGE',
            image: _getImageBlock(`${this.assetsHost}/sku.${sku}.secondary.${i}`),
            link: s.link,
          });
          break;
        case 'DYNAMIC':
          secondary.push({
            type: 'IMAGE',
            image: _getImageBlock(`${this.flexHost}/skn/v1/card/secondary/${i}/${token}`),
            link: s.link,
          });
          break;
        case 'VIDEO':
          secondary.push({
            type: 'VIDEO',
            image: _getImageBlock(`${this.assetsHost}/sku.${sku}.secondary.${i}`),
            video: _getVideoBlock(`${this.assetsHost}/sku.${sku}.secondary.${i}`),
            link: s.link,
          });
          break;
        case 'YOUTUBE':
          secondary.push({
            type: 'VIDEO',
            src: s.src,
          });
          break;
        default:
          throw new Error(`unsupported primary media type '${media.primary.type}'. Must be 'STATIC', 'DYNAMIC', 'VIDEO' or 'YOUTUBE'`);
      }
    }

    return [primary, secondary];

  }

  private getMediaFromSkn(sku: string, skn: string, token: string): [PrimaryMediaDto, SecondaryMediaDto[]] {

    let primary: PrimaryMediaDto;

    switch (skn) {
      case 'STATIC':  // TODO (sam) once we are confident that v1/v2 items are always DYNAMIC, this line can be removed
      case 'DYNAMIC':
        primary = {
          type: 'IMAGE',
          image: _getImageBlock(`${this.flexHost}/skn/v1/card/default/${token}`),
        };
        break;
      case 'VIDEO':
        primary = {
          type: 'VIDEO',
          image: _getImageBlock(`${this.assetsHost}/sku.${sku}.skn`),
          video: _getVideoBlock(`${this.assetsHost}/sku.${sku}.skn`),
        };
        break;
      default:
        throw new Error(`unsupported skn value '${skn}'. Must be 'STATIC', 'DYNAMIC' or 'VIDEO'`)
    }

    const secondary: SecondaryMediaDto[] = [{
      type: 'IMAGE',
      image: _getImageBlock(`${this.flexHost}/skn/v1/back/default/${token}`),
    }];

    return [primary, secondary];

  }
}
