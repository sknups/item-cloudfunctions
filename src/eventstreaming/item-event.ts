import { IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateIf } from 'class-validator';
import { BaseEvent } from './base-event';

export enum ItemEventType {
  CREATE,
  MINT,
  NFT_TRANSFER,
}

export class ItemEvent extends BaseEvent {
  public static DATA_VERSION = 3;

  public getDataType(): string {
    return 'ITEM';
  }

  // Additional validation of dataEvent from parent class
  @IsEnum(ItemEventType)
  public dataEvent: string;

  @Min(ItemEvent.DATA_VERSION)
  @Max(ItemEvent.DATA_VERSION)
  public dataVersion: number = ItemEvent.DATA_VERSION;

  @IsDate()
  @IsNotEmpty()
  public dataTimestamp: Date;

  @IsString()
  @IsNotEmpty()
  public retailSource: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((_, value) => value != null) // allow null
  public retailUserId?: string | null;

  @IsString()
  @IsNotEmpty()
  public itemCode: string;

  @IsString()
  @IsNotEmpty()
  public brandCode: string;

  @IsString()
  @IsNotEmpty()
  public brandName: string;

  @IsInt()
  @Min(0)
  @Max(Number.MAX_VALUE)
  @ValidateIf((_, value) => value != null) // allow null
  public brandWholesalePrice?: number | null;

  @IsNumber()
  @Min(0)
  @Max(Number.MAX_VALUE)
  public brandWholesalerShare: number;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((_, value) => value != null) // allow null
  public claimCode?: string | null;

  @IsInt()
  @Min(0)
  @Max(Number.MAX_VALUE)
  @ValidateIf((_, value) => value != null) // allow null
  public maxQty?: number | null;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((_, value) => value != null) // allow null
  public nftAddress?: string | null;

  @IsString()
  @IsNotEmpty()
  public nftState: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((_, value) => value != null) // allow null
  public ownerAddress?: string | null;

  @IsString()
  @IsNotEmpty()
  public platformCode: string;

  @IsInt()
  @Min(0)
  @Max(Number.MAX_VALUE)
  @ValidateIf((_, value) => value != null) // allow null
  public rrp?: number | null;

  @IsInt()
  @Min(0)
  @Max(Number.MAX_VALUE)
  @ValidateIf((_, value) => value != null) // allow null
  public saleQty?: number | null;

  @IsString()
  @IsNotEmpty()
  public source: string;

  @IsString()
  @IsNotEmpty()
  public state: string;

  @IsString()
  @IsNotEmpty()
  public skuCode: string;

  @IsString()
  @IsNotEmpty()
  public skuName: string;

  @IsInt()
  @Min(0)
  @Max(Number.MAX_VALUE)
  @ValidateIf((_, value) => value != null) // allow null
  public skuRarity?: number | null;

  @IsString()
  @IsOptional()
  public tier?: string | null;
}
