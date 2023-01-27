import { plainToInstance } from 'class-transformer';
import { validateSyncOrThrow } from '../helpers/validation';
import { InternalItemMediaDto } from '../dto/internal/item-media-internal.dto';

export function parseMedia(media: string | null): InternalItemMediaDto | null {
  if (!media) {
    return null;
  }

  const result: InternalItemMediaDto = plainToInstance(InternalItemMediaDto, JSON.parse(media));

  validateSyncOrThrow(result);
  return result;
}

export type LegacyCardLabels = {
  [key: string]: string;
}

export type LegacyCard = {
  front?: LegacyCardLabels[];
  back?: LegacyCardLabels[];
}

export function parseCard(card: string): LegacyCard {
  return JSON.parse(card);
}
