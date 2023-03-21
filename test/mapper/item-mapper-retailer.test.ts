import "reflect-metadata";
import { RetailerItemMapper } from "../../src/mapper/retailer/item-mapper-retailer";
import { TEST_ENTITIES } from '../test-data-entities';
import { TEST_DTOS } from '../test-data-dtos';
import { ItemEntity } from "../../src/entity/item.entity";
import { RetailerItemDto } from "../../src/dto/retailer/item-retailer.dto";

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

  it('creates item dto structure - v3 - without 3d', () => {
    const entity = {
      ...TEST_ENTITIES.v3.sale,
      // Inject three.type=NONE into the media JSON of the test entity
      media: `{"three":{"type":"NONE"},${TEST_ENTITIES.v3.sale.media?.substring(1)}`,
    };
    const expectedDto = {
      ...TEST_DTOS.v3.sale.retailer,
      media: {
        primary: TEST_DTOS.v3.sale.retailer.media.primary,
        secondary: TEST_DTOS.v3.sale.retailer.media.secondary,
        social: TEST_DTOS.v3.sale.retailer.media.social,
        // model should be absent
      }
    };
    expect(instance.toDto(entity)).toEqual(expectedDto);
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

  it('sets issue number to null if it is a v1 SKU with rarity 0', () => {
    const entity: ItemEntity = TEST_ENTITIES.v1.sale;
    entity.stockKeepingUnitRarity = 0;
    const expectedDto: RetailerItemDto = TEST_DTOS.v1.sale.retailer;
    expectedDto.issue = null;
    expect(instance.toDto(entity)).toEqual(expectedDto)
  });

  it('sets issue number if it is a v1 SKU with rarity higher than 0', () => {
    const entity: ItemEntity = TEST_ENTITIES.v1.sale;
    entity.stockKeepingUnitRarity = 1;
    const expectedDto: RetailerItemDto = TEST_DTOS.v1.sale.retailer;
    expectedDto.issue = 2;
    expect(instance.toDto(entity)).toEqual(expectedDto);
  });

  it('sets maximum number to null if it is a v1 SKU with rarity 0', () => {
    const entity: ItemEntity = TEST_ENTITIES.v1.sale;
    entity.stockKeepingUnitRarity = 0;
    const expectedDto: RetailerItemDto = TEST_DTOS.v1.sale.retailer;
    expectedDto.issue = null;
    expectedDto.maximum = null;
    expect(instance.toDto(entity)).toEqual(expectedDto);
  });

  it('sets maximum number to null if it is a v1 SKU with rarity 1', () => {
    const entity: ItemEntity = TEST_ENTITIES.v1.sale;
    entity.stockKeepingUnitRarity = 1;
    const expectedDto: RetailerItemDto = TEST_DTOS.v1.sale.retailer;
    expectedDto.issue = 2;
    expectedDto.maximum = null;
    expect(instance.toDto(entity)).toEqual(expectedDto);
  });

  it('sets maximum number if it is a v1 SKU with rarity higher than 1', () => {
    const entity: ItemEntity = TEST_ENTITIES.v1.sale;
    entity.stockKeepingUnitRarity = 2;
    const expectedDto: RetailerItemDto = TEST_DTOS.v1.sale.retailer;
    expectedDto.issue = 2;
    expectedDto.maximum = 10000;
    expect(instance.toDto(entity)).toEqual(expectedDto);
  });

  it('sets issue number to null if it is a v2 SKU and card json does not include \'${issue}\'', () => {
    const entity: ItemEntity = TEST_ENTITIES.v2.sale;
    entity.card = null;
    const expectedDto: RetailerItemDto = TEST_DTOS.v2.sale.retailer;
    expectedDto.issue = null;
    expectedDto.maximum = null;
    expect(instance.toDto(entity)).toEqual(expectedDto);
  });

  it('sets maximum number to null if it is a v2 SKU and card json does not include \'${maximum}\'', () => {
    const entity: ItemEntity = TEST_ENTITIES.v2.sale;
    entity.card = null;
    const expectedDto: RetailerItemDto = TEST_DTOS.v2.sale.retailer;
    expectedDto.issue = null;
    expectedDto.maximum = null;
    expect(instance.toDto(entity)).toEqual(expectedDto);
  });

  it('sets issue and maximum number if it is a v2 SKU and card json includes \'${issue}\' and \'${maximum}\'', () => {
    expect(instance.toDto(TEST_ENTITIES.v2.sale)).toEqual(TEST_DTOS.v2.sale.retailer)
  });

  it('sets issue number to null if it is a v3 SKU and media json doesn\'t include \'${issue}\'', () => {
    const entity: ItemEntity = TEST_ENTITIES.v3.sale;
    const expectedDto: RetailerItemDto = TEST_DTOS.v3.sale.retailer;
    expectedDto.issue = null;
    expectedDto.maximum = null;
    expect(instance.toDto(entity)).toEqual(expectedDto);
  });

  it('sets maximum number to null if it is a v3 SKU and media json does not include \'${maximum}\'', () => {
    const entity: ItemEntity = TEST_ENTITIES.v3.sale;
    const expectedDto: RetailerItemDto = TEST_DTOS.v3.sale.retailer;
    expectedDto.issue = null;
    expectedDto.maximum = null;
    expect(instance.toDto(entity)).toEqual(expectedDto);
  });

  it('sets issue and maximum number if it is a v3 SKU and media json includes \'${issue}\' and \'${maximum}\'', () => {
    const entity: ItemEntity = TEST_ENTITIES.v3.sale;
    entity.media = "{\"primary\":{\"type\":\"VIDEO\"},\"secondary\":[{\"type\":\"VIDEO\",\"link\":\"https://sknups.com\"},{\"type\":\"STATIC\",\"link\":\"https://sknups.com\"},{\"type\":\"DYNAMIC\",\"labels\":[{\"text\":\"${issue}/${maximum}\",\"color\":\"#FFFFFFAA\",\"size\":\"30pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1220}],\"link\":\"https://sknups.com\"}]}";
    const expectedDto: RetailerItemDto = TEST_DTOS.v3.sale.retailer;
    expectedDto.issue = 2;
    expectedDto.maximum = 2500;
    expect(instance.toDto(entity)).toEqual(expectedDto);
  });

});
