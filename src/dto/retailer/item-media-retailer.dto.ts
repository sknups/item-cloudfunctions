import { PrimaryMediaDto } from './item-media-retailer-primary.dto';
import { SecondaryMediaDto } from './item-media-retailer-secondary.dto';

/**
 * Supported set of media types.
 */
export enum RetailerItemMediaTypeDto {

  IMAGE = 'IMAGE',

  VIDEO = 'VIDEO',

}

/**
 * The item media exposed to retailers.
 * 
 * This is transformed from the 'media' property stored in datastore into a series of image/video links.
 */
export class RetailerItemMediaDto {

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

/**
 * Links to image media for different image/ mime types.
 *
 * It is assumed that we always publish the same set of file types.
 */
export class ImageMediaUrlsDto {

  jpeg: string;

  png: string;

  webp: string;

}

/**
 * Defines the available properties for IMAGE media.
 */
export class ImageMediaDto {

  type: RetailerItemMediaTypeDto.IMAGE;

  image: ImageMediaUrlsDto;

}

/**
 * Links to video media for different video/ mime types.
 *
 * It is assumed that we always publish the same set of file types.
 */
export class VideoMediaUrlsDto {

  mp4: string;

}

/**
 * Defines the available properties for VIDEO media.
 */
export class VideoMediaDto {

  type: RetailerItemMediaTypeDto.VIDEO;

  image: ImageMediaUrlsDto;

  video: VideoMediaUrlsDto;

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
