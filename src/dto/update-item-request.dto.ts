import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export enum UpdateItemOperation {
  MINTING = 'MINTING',
  MINTED = 'MINTED',
  MINT_FAILED = 'MINT_FAILED',
  OWNER_ADDRESS = 'OWNER_ADDRESS',
}

export class UpdateItemRequestDto {
  @IsEnum(UpdateItemOperation)
  operation: UpdateItemOperation;

  @IsString()
  @IsNotEmpty()
  @ValidateIf(
    o => [
      UpdateItemOperation.MINTING,
    ].includes(o.operation))
  nftAddress: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf(
    o => [
      UpdateItemOperation.MINTING,
      UpdateItemOperation.OWNER_ADDRESS,
    ].includes(o.operation))
  ownerAddress: string;
}
