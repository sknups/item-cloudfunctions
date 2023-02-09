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

