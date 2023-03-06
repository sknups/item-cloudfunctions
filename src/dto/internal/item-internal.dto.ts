import { InternalItemMediaDto } from './item-media-internal.dto';
import { ItemDto } from '../item.dto';

/**
 * Extension of ItemDto to provide additional fields for internal consumption.
 * 
 * This is intended to be exposed to other internal SKNUPS services.
 * 
 * It MUST NOT be exposed to retailers over retailer API.
 */
export class InternalItemDto extends ItemDto {

  /**
   * Card information as json string for the item.
   * 
   * @deprecated use media.primary.labels instead.
   */
  cardJson: string | null;

  /**
   * The address of the item on the blockchain.
   * 
   * Format: <blockchain>.<network>.<address>
   */
  nftAddress: string | null;

  /**
   * The address of the item owner on the blockchain.
   * 
   * Format: <blockchain>.<network>.<address>
   */
  ownerAddress: string | null;

  /**
    * Internal media information for item.
    * 
    * For v3+ SKU this is based on the media property.
    * For v2 SKU it is computed from the skn and card properties.
    * For v1 SKU it is null.
    */
  media: InternalItemMediaDto | null;

  /**
   * rarity of item
   */
  rarity: number | null;

}
