import { RetailerItemMediaDto } from './item-media-retailer.dto';
import { ItemDto } from '../item.dto';

/**
 * Extension of ItemDto to provide additional fields for retailer consumption.
 * 
 * This is intended to be exposed to retailers.
 */
export class RetailerItemDto extends ItemDto {

  /**
   * media links for the item
   */
  media: RetailerItemMediaDto;

}

/**
 * @deprecated
 */
export class LegacyRetailerItemDto extends RetailerItemDto {

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
  saleQty: number | null;

  /**
   * claim code this item relates to, when created in a giveaway
   * @deprecated use giveaway
   */
  claimCode: string | null;

  /**
   * Maximum quantity available
   * @deprecated use maximum
   */
  maxQty: number | null;

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
  recommendedRetailPrice: number | null;

}
