import { ImageMediaDTO, ItemMediaDTO, ModelMediaDTO, VideoMediaDTO } from "../dto/get-items-response.dto";


export class ItemMediaDTOMapper {

  private assetsHost: string;

  constructor(
    assetsHost: string,
  ) {
    this.assetsHost = assetsHost;
  }

  toDTO(flexHost: string, sku: string, skn: string, token: string): ItemMediaDTO {

    return new ItemMediaDTO(
      //skn
      this.getSknMedia(flexHost, sku, skn, token),
      //info
      new ImageMediaDTO(
        `${flexHost}/skn/v1/back/default/${token}.jpg`,
      ),
      //social
      new ImageMediaDTO(
        `${flexHost}/skn/v1/card/og/${token}.png`,
      ),
      //snapchat
      new ImageMediaDTO(
        `${flexHost}/skn/v1/card/snapchat/${token}.png`,
      ),
      //model
      new ModelMediaDTO(
        `${this.assetsHost}/sku.v1.3DView.${sku}.glb`,
        `${this.assetsHost}/sku.v1.3DConfig.${sku}.json`,
      ),
    );
  }

  private getSknMedia(flexHost: string, sku: string, skn: string, token: string): ImageMediaDTO | VideoMediaDTO {

    switch (skn) {
      case 'STATIC':
        return new ImageMediaDTO(
          `${flexHost}/skn/v1/card/default/${token}.jpg`,
        )
      case 'VIDEO':
        return new VideoMediaDTO(
          `${this.assetsHost}/sku.${sku}.skn.jpg`,
          `${this.assetsHost}/sku.${sku}.skn.mp4`,
        )
      default:
        throw new Error(`unsupported skn value '${skn}'. Must be 'STATIC' or 'VIDEO'`)
    }

  }
}