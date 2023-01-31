import "reflect-metadata";
import { InternalItemMapper } from "../../src/mapper/internal/item-mapper-internal";
import { TEST_ENTITIES } from '../test-data-entities';
import { TEST_DTOS } from '../test-data-dtos';

describe('mapper - item - internal', () => {

  const instance = new InternalItemMapper();

  it('creates item dto structure', () => {
    expect(instance.toDto(TEST_ENTITIES.v2.sale.full)).toEqual(TEST_DTOS.v2.sale.internal)
  });

  it('can handle numeric timestamp', () => {
    expect(instance.toDto({ ...TEST_ENTITIES.v2.sale.full, created: new Date(TEST_ENTITIES.v2.sale.full.created.getTime()) })).toEqual(TEST_DTOS.v2.sale.internal);
  });

});
