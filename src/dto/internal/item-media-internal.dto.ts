import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsObject, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';

export enum InternalItemMediaTypeDto {
  STATIC = 'STATIC',
  DYNAMIC = 'DYNAMIC',
  VIDEO = 'VIDEO',
}

export class InternalItemMediaLabelsDto {
  [key: string]: any;
}

export class InternalItemPrimaryMediaDto {
  @IsEnum(InternalItemMediaTypeDto)
  type: InternalItemMediaTypeDto;

  @ValidateIf(o => o.type === InternalItemMediaTypeDto.DYNAMIC)
  @IsArray()
  labels?: InternalItemMediaLabelsDto[];
}

export class InternalItemSecondaryMediaDto extends InternalItemPrimaryMediaDto {
  @IsOptional()
  @IsString()
  link?: string;
}

export enum InternalItemThreeMediaTypeDto {
  SIMPLE = 'SIMPLE',
  NONE = 'NONE',
}

export class InternalItemThreeMediaDto {
  @IsEnum(InternalItemThreeMediaTypeDto)
  type: InternalItemThreeMediaTypeDto;
}

/**
 * The item media exposed to internal clients.
 * 
 * Represents the 'media' property stored in datastore in its (almost) raw form.
 * 
 * As this is held as a string in datastore validation decorators are used to ensure
 * the data is read as expected.
 */
export class InternalItemMediaDto {
  @IsObject()
  @ValidateNested()
  @Type(() => InternalItemPrimaryMediaDto)
  primary: InternalItemPrimaryMediaDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InternalItemSecondaryMediaDto)
  secondary: InternalItemSecondaryMediaDto[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => InternalItemThreeMediaDto)
  three?: InternalItemThreeMediaDto;
}
