import { IsNotEmpty, isEmpty, IsString, ValidateIf } from 'class-validator';

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
  @IsString()
  @ValidateIf(o => isEmpty(o.blockchainAddress) &&  isEmpty(o.user) )
  @IsNotEmpty({message: '\'$property\' missing. must supply at least emailAddress, user or blockchainAddress'})
  emailAddress?: string;

  /**
  * The User that owns the items 
  */
  @IsString()
  @ValidateIf(o => isEmpty(o.blockchainAddress) &&  isEmpty(o.emailAddress) )
  @IsNotEmpty({message: '\'$property\' missing. must supply at least emailAddress, user or blockchainAddress'})
  user?: string;

  /**
  * The Owner blockchain wallet address. 
  */
  @IsString()
  @ValidateIf(o => isEmpty(o.emailAddress) &&  isEmpty(o.user) )
  @IsNotEmpty({message: '\'$property\' missing. must supply at least emailAddress, user or blockchainAddress'})
  blockchainAddress?: string;
}
