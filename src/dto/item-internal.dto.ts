import { ItemDto } from './item.dto';

/**
 * Extension of ItemDto to provide additional fields for internal consumption.
 * 
 * This is intended to be exposed to other internal SKNUPS services.
 * 
 * It MUST NOT be exposed to retailers over retailer API.
 */
export class InternalItemDto extends ItemDto {

  /**
   * Card information as json string for the item
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
  * Internal media information for item as json string
  */
  media: string | null;

}
