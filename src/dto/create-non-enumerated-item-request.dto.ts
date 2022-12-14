import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNonEnumeratedItemRequestDTO {
  /**
   * The stock keeping unit (SKU) code of the item to be manufactured.
   *
   * @example 'TEST-DODECAHEDRON-COMMON'
   */
  @IsString()
  @IsNotEmpty()
  public readonly skuCode: string;

  /**
   * Email address of the item owner.
   *
   * @example 'bob@example.com'
   */
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public readonly email: string;

  /**
   * User of the item owner.
   */
   @IsString()
   @IsOptional()
   public readonly user?: string;

  /**
   * The claim code used to redeem this giveaway item.
   *
   * @example 'dodecahedron'
   */
  @IsString()
  @IsNotEmpty()
  public readonly claimCode: string;
}
