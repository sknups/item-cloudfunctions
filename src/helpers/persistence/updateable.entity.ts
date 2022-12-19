import { BaseEntity } from './base.entity';

/**
 * Entity that can be updated, therefore has an updated timestamp.
 */
export type UpdateableEntity = BaseEntity & {

  /**
   * Timestamp of entity creation.
   */
  created: Date;

  /**
   * Timestamp of entity modification.
   * 
   * This should match created if never modified.
   */
  updated: Date;

}
