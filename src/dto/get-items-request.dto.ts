import { IsNotEmpty, isEmpty, IsString, ValidateIf, IsOptional } from 'class-validator';

export class GetItemsRequestDTO {

  /**
   * The platformCode of the catalog.
   */
  @IsString()
  @IsNotEmpty()
  platformCode: string;

  /**
  * The Owner email address.
  */
  @IsOptional()
  @IsString()
  emailAddress?: string;

  /**
  * The User that owns the items 
  */
  @IsString()
  @ValidateIf(o => isEmpty(o.blockchainAddress) )
  @IsNotEmpty({message: '\'$property\' missing. must supply at least user or blockchainAddress'})
  user?: string;

  /**
  * The Owner blockchain wallet address. 
  */
  @IsString()
  @ValidateIf(o => isEmpty(o.user) )
  @IsNotEmpty({message: '\'$property\' missing. must supply at least user or blockchainAddress'})
  blockchainAddress?: string;
}
