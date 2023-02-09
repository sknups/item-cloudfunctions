import "reflect-metadata";
import { RetailerItemMapper } from "../../src/mapper/retailer/item-mapper-retailer";
import { TEST_ENTITIES } from '../test-data-entities';
import { TEST_DTOS } from '../test-data-dtos';

describe('mapper - item - retailer', () => {

  const instance = new RetailerItemMapper(
    "https://assets-dev.sknups.gg",
    "https://flex-dev.sknups.com",
  );

  it('creates item dto structure - v2', () => {
    expect(instance.toDto(TEST_ENTITIES.v2.sale)).toEqual(TEST_DTOS.v2.sale.retailer)
  });

  it('creates item dto structure - v3', () => {
    expect(instance.toDto(TEST_ENTITIES.v3.sale)).toEqual(TEST_DTOS.v3.sale.retailer)
  });

  it('generates \'VIDEO\' media structure', () => {
    const sku = TEST_DTOS.v2.sale.retailer.sku;

    const expectedDto = {
      ...TEST_DTOS.v2.sale.retailer,
      media: {
        ...TEST_DTOS.v2.sale.retailer.media,
        primary: {
          type: 'VIDEO',
          image: {
            jpeg: `https://assets-dev.sknups.gg/sku.${sku}.primary.jpg`,
            png: `https://assets-dev.sknups.gg/sku.${sku}.primary.png`,
            webp: `https://assets-dev.sknups.gg/sku.${sku}.primary.webp`,
          },
          video: {
            mp4: `https://assets-dev.sknups.gg/sku.${sku}.primary.mp4`,
          },
        },
      }
    }
    expect(instance.toDto({ ...TEST_ENTITIES.v2.sale, skn: 'VIDEO' })).toEqual(expectedDto);
  });

  it('throws error if skn is not \'DYNAMIC\' or \'VIDEO\'', () => {
    expect(() => {
      instance.toDto({ ...TEST_ENTITIES.v2.sale, skn: 'STATIC' })
    }).toThrow("Unsupported legacy skn value 'STATIC'");
  });

});
