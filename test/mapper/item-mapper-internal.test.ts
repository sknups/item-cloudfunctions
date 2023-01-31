import "reflect-metadata";
import { InternalItemMapper } from "../../src/mapper/internal/item-mapper-internal";
import { TEST_ENTITIES } from '../test-data-entities';
import { TEST_DTOS } from '../test-data-dtos';

describe('mapper - item - internal', () => {

  const instance = new InternalItemMapper();

  it('creates item dto structure - v2', () => {
    expect(instance.toDto(TEST_ENTITIES.v2.sale)).toEqual(TEST_DTOS.v2.sale.internal)
  });

  it('creates item dto structure - v3', () => {
    expect(instance.toDto(TEST_ENTITIES.v3.sale)).toEqual(TEST_DTOS.v3.sale.internal)
  });

});
