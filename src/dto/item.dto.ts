import { ItemMediaDto } from './item-media.dto';

export class ItemDto {

  /**
   * item identifier
   */
  token: string;

  /**
   * item issue 
   */
  issue: number;

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
   * - MINTED
   */
  nftState: ItemNftState;

  /**
   * claim code this item relates to, when created in a giveaway
   */
  giveaway: string | null;

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
   */
  brand: string;

  /**
   * code representing the platform
   */
  platform: string;

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
  media: ItemMediaDto;

}

export enum ItemNftState {

  UNMINTED = 'UNMINTED',
  MINTING = 'MINTING',
  MINTED = 'MINTED',

}

export enum ItemSource {

  GIVEAWAY = 'GIVEAWAY',
  SALE = 'SALE',

}


/**
 * @deprecated
 */
export class LegacyItemDto extends ItemDto {

  /**
   * item identifier
   * @deprecated use token
   */
  thumbprint: string;

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
   * claim code this item relates to, when created in a giveaway
   * @deprecated use giveaway
   */
  claimCode: string | null;

  /**
   * Maximum quantity available
   * @deprecated use maximum
   */
  maxQty: number;

  /**
   * Code representing the brand
   * @deprecated use brand
   */
  brandCode: string;

  /**
   * code representing the platform
   * @deprecated use platform
   */
  platformCode: string;

  /**
   * SKU of item
   * @deprecated use sku
   */
  stockKeepingUnitCode: string;

  /**
   * The price for which this item was sold to the consumer.
   * @deprecated use rrp
   */
  recommendedRetailPrice: number;

}
