export class ItemDto {

  /**
   * item identifier
   */
  token: string;

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
   * Date time item was created in ISO-8601
   */
  created: string;

  /**
  * Data model version of item
  */
  version: string;

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
