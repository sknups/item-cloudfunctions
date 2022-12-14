export class ImageMediaDTO {
  constructor(
    image: string
  ) {
    this.image = image;
  }

  image: string
}

export class VideoMediaDTO extends ImageMediaDTO {
  constructor(
    image: string,
    video: string
  ) {
    super(image);
    this.video = video;
  }
  video: string
}

export class ModelMediaDTO {
  constructor(
    glb: string,
    config: string
  ) {
    this.glb = glb;
    this.config = config;
  }

  glb: string
  config: string
}

export class ItemMediaDTO {
  constructor(
    skn: ImageMediaDTO | VideoMediaDTO,
    info: ImageMediaDTO,
    social: ImageMediaDTO,
    snapchat: ImageMediaDTO,
    model: ModelMediaDTO,
  ) {
    this.skn = skn;
    this.info = info;
    this.social = social;
    this.snapchat = snapchat;
    this.model = model;
  }

  //Media links for skn (previously known as the card front)
  //Supports images and video
  skn: ImageMediaDTO | VideoMediaDTO

  //links to info media (previously known as the card back)
  //Supports images
  info: ImageMediaDTO

  //links to social media, used in metadata tags for unfurling 
  //Supports images
  social: ImageMediaDTO

  //links to snapchat media, used in metadata tags for snapchat 
  //Supports images
  snapchat: ImageMediaDTO

  //links to the 3d model and configuration
  model: ModelMediaDTO
}



export class ItemDTO {
  constructor(
    token: string,
    flexHost: string,
    cardJson: string | null,
    sknappHost: string,
    certVersion: string,
    issue: number,
    maximum: number,
    source: ItemSource,
    nftState: ItemNFTState,
    giveaway: string,
    name: string,
    description: string,
    brand: string,
    platform: string,
    sku: string,
    tier: string | null,
    rrp: number,
    created: string,
    rarity: number | null,
    version: string,
    media: ItemMediaDTO,
  ) {
    this.thumbprint = token;
    this.token = token;
    this.flexHost = flexHost;
    this.sknappHost = sknappHost;
    this.certVersion = certVersion;
    this.saleQty = issue;
    this.issue = issue;
    this.maxQty = maximum;
    this.maximum = maximum;
    this.source = source;
    this.nftState = nftState;
    this.claimCode = giveaway;
    this.giveaway = giveaway;
    this.name = name;
    this.description = description;
    this.brandCode = brand;
    this.brand = brand;
    this.platformCode = platform;
    this.platform = platform;
    this.stockKeepingUnitCode = sku;
    this.sku = sku;
    this.tier = tier;
    this.recommendedRetailPrice = rrp;
    this.rrp = rrp;
    this.created = created
    this.cardJson = cardJson;
    this.rarity = rarity;
    this.version = version;
    this.media = media;
  }

  /**
   * item identifier
   * @deprecated use token
   */
  thumbprint: string;

  /**
   * item identifier
   */
  token: string;

  /**
   * Host for flex server
   * @deprecated should use media
   */
  flexHost: string;

  /**
   * Host for the sknups application
   * @deprecated
   */
  sknappHost: string;

  /**
   * certificate version
   * @deprecated
   */
  certVersion: string;

  /**
   * sale quantity 
   * @deprecated use issue
   */
  saleQty: number;

  /**
   * item issue 
   */
  issue: number;

  /**
   * Maximum quantity available
   * @deprecated use maximum
   */
  maxQty: number;

  /**
   * Maximum quantity available
   */
  maximum: number;

  /**
   * Item source 
   * - GIVEAWAY
   * - SALE
   */
  source: ItemSource;

  /**
   * NFT minting state. 
   * - UNMINTED
   * - MINTING
   *- MINTED
   */
  nftState: ItemNFTState;

  /**
   * claim code this item relates to, when created in a giveaway
   * @deprecated use giveaway
   */
  claimCode: string;

  /**
   * claim code this item relates to, when created in a giveaway
   */
  giveaway: string;

  /**
   * name of item
   */
  name: string;

  /**
   * detailed description
   */
  description: string;

  /**
   * Code representing the brand
   * @deprecated use brand
   */
  brandCode: string;

  /**
   * Code representing the brand
   */
  brand: string;

  /**
   * code representing the platform
   * @deprecated use platform
   */
  platformCode: string;

  /**
   * code representing the platform
   */
  platform: string;

  /**
   * SKU of item
   * @deprecated use sku
   */
  stockKeepingUnitCode: string;

  /**
   * SKU of item
   */
  sku: string;


  /**
   * The tier e.g GREEN
   */
  tier: string | null;

  /**
   * The price for which this item was sold to the consumer.
   * @deprecated use rrp
   */
  recommendedRetailPrice: number;

  /**
   * The price for which this item was sold to the consumer.
   */
  rrp: number;

  /**
   * Date time item was created in ISO-8601
   */
  created: string;

  /**
  * card information as json string for the item
  */
  cardJson: string | null;

  /**
  * rarity of item
  */
  rarity: number | null;

  /**
  * Data model version of item
  */
  version: string;

  /**
   * media links for the item
   */
  media: ItemMediaDTO;
}

export enum ItemSource {
  GIVEAWAY = 'GIVEAWAY',
  SALE = 'SALE',
}

export enum ItemNFTState {
  UNMINTED = 'UNMINTED',
  MINTING = 'MINTING',
  MINTED = 'MINTED',
}