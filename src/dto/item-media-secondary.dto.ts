import { ImageMediaDto, VideoMediaDto } from './item-media-type.dto';

/**
 * Extension for secondary media to provide an optional link
 */
export class SecondaryImageMediaDto extends ImageMediaDto {

  link?: string;

}

/**
 * Extension for secondary media to provide an optional link
 */
export class SecondaryVideoMediaDto extends VideoMediaDto {

  link?: string;

}

export type SecondaryMediaDto = SecondaryImageMediaDto | SecondaryVideoMediaDto;
