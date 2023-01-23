import { ImageMediaDto, ItemMediaDto, VideoMediaDto } from '../dto/item-media.dto';


export class ItemMediaDTOMapper {

  private assetsHost: string;

  constructor(
    assetsHost: string,
  ) {
    this.assetsHost = assetsHost;
  }

  toDTO(flexHost: string, sku: string, skn: string, token: string): ItemMediaDto {

    return {
      info: {
        image: `${flexHost}/skn/v1/back/default/${token}.jpg`,
      },
      model: {
        config: `${this.assetsHost}/sku.v1.3DConfig.${sku}.json`,
        glb: `${this.assetsHost}/sku.v1.3DView.${sku}.glb`,
      },
      skn: this.getSknMedia(flexHost, sku, skn, token),
      snapchat: {
        image: `${flexHost}/skn/v1/card/snapchat/${token}.png`,
      },
      social: {
        image: `${flexHost}/skn/v1/card/og/${token}.png`,
      },
    };

  }

  private getSknMedia(flexHost: string, sku: string, skn: string, token: string): ImageMediaDto | VideoMediaDto {

    switch (skn) {
      case 'STATIC':
      case 'DYNAMIC':
        return { image: `${flexHost}/skn/v1/card/default/${token}.jpg` };
      case 'VIDEO':
        return {
          image: `${this.assetsHost}/sku.${sku}.skn.jpg`,
          video: `${this.assetsHost}/sku.${sku}.skn.mp4`,
        };
      default:
        throw new Error(`unsupported skn value '${skn}'. Must be 'STATIC', 'DYNAMIC' or 'VIDEO'`)
    }

  }
}
