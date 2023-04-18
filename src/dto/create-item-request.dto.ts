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

export class CreateItemFromGiveawayRequestDto {

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
