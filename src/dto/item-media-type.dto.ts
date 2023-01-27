/**
 * Supported set of media types.
 */
export enum ItemMediaTypeDto {

  IMAGE = 'IMAGE',

  VIDEO = 'VIDEO',

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
 * Links to video media for different video/ mime types.
 * 
 * It is assumed that we always publish the same set of file types.
 */
export class VideoMediaUrlsDto {

  mp4: string;

}

/**
 * Defines the available properties for IMAGE media.
 */
export class ImageMediaDto {

  type: ItemMediaTypeDto.IMAGE;

  image: ImageMediaUrlsDto;

}

/**
 * Defines the available properties for VIDEO media.
 */
export class VideoMediaDto {

  type: ItemMediaTypeDto.VIDEO;

  image: ImageMediaUrlsDto;

  video: VideoMediaUrlsDto;

}
