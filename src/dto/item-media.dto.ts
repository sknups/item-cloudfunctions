export class ItemMediaDto {

  /**
   * Primary media links for skn (previously known as the card front)
   *
   * Supports images and video
   */
  primary: PrimaryMediaDto;

  /**
   * Secondary media links for skn for use in item carousel.
   *
   * May be of size 0.
   *
   * Support images, video and youtube.
   * Images and video can include an optional hyperlink.
   *
   * For legacy SKN (v1 and v2) this contains only the info media (or card back)
   */
  secondary: SecondaryMediaDto[];

  /**
   * Links to social media, used in metadata tags for unfurling
   * 
   * Supports images
   */
  social: SocialMediaDto;

  /**
   * Links to the 3d model and configuration
   */
  model: ModelMediaDto;

}

export class ImageMediaDto {
  jpeg: string;
  png: string;
  webp: string;
}

export class VideoMediaDto {
  mp4: string;
}

export class PrimaryMediaDto {

  type: 'IMAGE' | 'VIDEO';

  /**
   * Populated for both IMAGE and VIDEO types.
   */
  image: ImageMediaDto;

  /**
   * Populated only for the VIDEO type.
   */
  video?: VideoMediaDto;

}

export class SecondaryMediaDto {

  type: 'IMAGE' | 'VIDEO' | 'YOUTUBE';

  /**
   * Populated for IMAGE and VIDEO types.
   */
  image?: ImageMediaDto;

  /**
   * Populated only for the VIDEO type.
   */
  video?: VideoMediaDto;

  /**
   * Populated only for the YOUTUBE type.
   */
  src?: string;

  /**
   * Optional, MAY be populated for the IMAGE and VIDEO types.
   */
  link?: string;

}

export class SocialMediaDto {

  default: {
    image: ImageMediaDto
  };

  snapchat: {
    image: ImageMediaDto
  };

}

export class ModelMediaDto {

  glb: string;

  config: string;

}
