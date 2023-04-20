import { Equals } from 'class-validator';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateItemRequestDto {
  /**
   * The stock keeping unit (SKU) code of the item to be manufactured.
   *
   * @example 'TEST-DODECAHEDRON-COMMON'
   */
  @IsString()
  @IsNotEmpty()
  public readonly skuCode: string;

  /**
   * User of the item owner.
   */
  @IsString()
  @IsNotEmpty()
  public readonly user: string;

  /**
   * The claim code used to redeem this giveaway item.
   * 
   * Only required when created giveaway items, ie:
   *   - v1 giveaway enumerated items (all SKU without a recommendedRetailPrice)
   *   - v2+ all non-enumerated items
   *
   * @example 'dodecahedron'
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly claimCode?: string;
}

export abstract class AbstractCreateItemRequestDto {

  /**
   * The stock keeping unit (SKU) code of the item to be manufactured.
   *
   * It MUST be a SKU that is claimable (=true)
   *
   * @example 'TEST-DODECAHEDRON-GIVEAWAY'
   */
  @IsString()
  @IsNotEmpty()
  public readonly sku: string;

  /**
   * User of the item owner.
   */
  @IsString()
  @IsNotEmpty()
  public readonly user: string;

  /**
   * @deprecated
   *
   * MUST NOT be provided.
   */
  @Equals(undefined)
  public readonly claimCode?: undefined;

}

export class CreateItemFromGiveawayRequestDto extends AbstractCreateItemRequestDto { }

export class CreateItemFromDropLinkRequestDto extends AbstractCreateItemRequestDto {

  /**
   * The giveaway code used to redeem the item using a drop link.
   *
   * @example 'dodecahedron'
   */
  @IsString()
  @IsNotEmpty()
  public readonly giveaway: string;

}

export class CreateItemFromPurchaseRequestDto extends AbstractCreateItemRequestDto {

  /**
   * The unique identifier of the transaction used to pay for the item.
   *
   * This is treated as opaque data and will initially be ignored.
   * It may be used in future, eg. to handle idempotency.
   *
   * The format of the transaction will depend on the payment service that was used.
   * The retailer may decide on the exact format, eg. including a prefix for each supported payment provider.
   *
   * @example 'abc41f9d-7f10-4f8b-87c3-674e75afc3d0'
   */
  @IsString()
  @IsNotEmpty()
  public readonly transaction: string;

}
