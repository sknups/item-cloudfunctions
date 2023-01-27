import { PrimaryMediaDto } from '../item-media-primary.dto';
import { SecondaryMediaDto } from '../item-media-secondary.dto';
import { ImageMediaUrlsDto } from '../item-media-type.dto';

/**
 * The item media exposed to retailers.
 * 
 * This is transformed from the 'media' property stored in datastore into a series of image/video links.
 */
export class ItemMediaDto {

  /**
   * Primary media links for skn.
   *
   * Supports images and video.
   */
  primary: PrimaryMediaDto;

  /**
   * Secondary media links for skn for use in item carousel.
   *
   * May be of size 0.
   *
   * Supports images, video and youtube.
   * Images and video can include an optional hyperlink.
   *
   * For legacy SKN (v1 and v2) this contains only the info media.
   */
  secondary: SecondaryMediaDto[];

  /**
   * Links to social media, used in metadata tags for unfurling.
   * 
   * Supports images.
   */
  social: SocialMediaDto;

  /**
   * Links to the 3d model and configuration.
   */
  model: ModelMediaDto;

}

export class SocialMediaDto {

  default: {
    image: ImageMediaUrlsDto
  };

  snapchat: {
    image: ImageMediaUrlsDto
  };

}

export class ModelMediaDto {

  glb: string;

  config: string;

}
