import 'reflect-metadata';
import { plainToInstance, Type } from 'class-transformer';
import { IsArray, IsEnum, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { validateSyncOrThrow } from '../helpers/validation';

export enum ItemEntityMediaType {
  STATIC = 'STATIC',
  DYNAMIC = 'DYNAMIC',
  VIDEO = 'VIDEO',
}

export class ItemEntityPrimaryMedia {
  @IsEnum(ItemEntityMediaType)
  type: ItemEntityMediaType;
}

export class ItemEntitySecondaryMedia {
  @IsEnum(ItemEntityMediaType)
  type: ItemEntityMediaType;

  @IsOptional()
  @IsString()
  link?: string;
}

export class ItemEntityMedia {
  @IsObject()
  @ValidateNested()
  @Type(() => ItemEntityPrimaryMedia)
  primary: ItemEntityPrimaryMedia;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemEntitySecondaryMedia)
  secondary: ItemEntitySecondaryMedia[];
}

export function parseMedia(media: string | null): ItemEntityMedia | null {
  if (!media) {
    return null;
  }

  const result: ItemEntityMedia = plainToInstance(ItemEntityMedia, JSON.parse(media));

  validateSyncOrThrow(result);
  return result;
}
