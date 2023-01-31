export class ItemDto {

  /**
   * item identifier
   */
  token: string;

  /**
   * item issue 
   * 
   * is null for non-enumerated items
   */
  issue: number | null;

  /**
   * Maximum quantity available
   * 
   * is null for non-enumerated items
   */
  maximum: number | null;

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
  rrp: number | null;

  /**
   * Date time item was created in ISO-8601
   */
  created: string;

  /**
  * rarity of item
  */
  rarity: number | null;

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
