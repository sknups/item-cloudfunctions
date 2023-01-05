import { EntityKey } from './base.entity';

export type MutationResult = {
  kind: string,
  key: EntityKey | null,
} | null;

