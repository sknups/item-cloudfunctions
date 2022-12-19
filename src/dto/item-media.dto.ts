export class ItemMediaDto {

  /**
   * Media links for skn (previously known as the card front)
   * 
   * Supports images and video
   */
  skn: ImageMediaDto | VideoMediaDto;

  /**
   * Links to info media (previously known as the card back)
   * 
   * Supports images
   */
  info: ImageMediaDto;

  /**
   * Links to social media, used in metadata tags for unfurling
   * 
   * Supports images
   */
  social: ImageMediaDto;

  /**
   * Links to snapchat media, used in metadata tags for snapchat
   * 
   * Supports images
   */
  snapchat: ImageMediaDto;

  /**
   * Links to the 3d model and configuration
   */
  model: ModelMediaDto;

}

export class ImageMediaDto {

  image: string;

}

export class VideoMediaDto extends ImageMediaDto {

  video: string;

}

export class ModelMediaDto {

  glb: string;
  config: string;

}
