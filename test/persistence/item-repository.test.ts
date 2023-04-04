import { Datastore } from '@google-cloud/datastore';
import { ItemRepository } from '../../src/persistence/item-repository';
import { NamedKeyEntity } from '../../src/helpers/persistence/base.entity';
import { TEST_ENTITIES } from '../test-data-entities';

const PLATFORM = 'SKN';
const WALLET = 'SOL.devnet.9H5c7kkULEmT7MvrJp1MEavN1tu7MN5uG5Yigb54D7Vx';
const USER = 'cyP1XYi0y6NadKRXqMbmF9R1vz53';

function _toDatastoreEntity(mappedEntity: NamedKeyEntity): any {
  const result: any = { ...mappedEntity };
  result[Datastore.KEY] = { name: mappedEntity.key };
  delete result.key;
  return result;
}

const SALE_QUERY_DATA = _toDatastoreEntity(TEST_ENTITIES.v2.sale);
const SALE_QUERY_DATA_MINTED = _toDatastoreEntity(TEST_ENTITIES.v2.minted);
const GIVEAWAY_QUERY_DATA = _toDatastoreEntity(TEST_ENTITIES.v2.giveaway);

function _transformedResponse(overrides: object): object[] {
  return [
    { ...TEST_ENTITIES.v2.sale, ...overrides },
    { ...TEST_ENTITIES.v2.giveaway, ...overrides },
  ];
}

describe('persistence', () => {

  const runQuerySpy = jest.spyOn(Datastore.prototype, 'runQuery');
  const runAggregationQuerySpy = jest.spyOn(Datastore.prototype, 'runAggregationQuery');
  const getSpy = jest.spyOn(Datastore.prototype, 'get');

  let instance: ItemRepository;

  beforeEach(function () {
    instance = new ItemRepository();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('byWalletAddress', () => {

    const overrides = { nftState: 'MINTED', ownerAddress: WALLET, user: 'abc432' };

    const filters = [
      { name: 'platformCode', op: '=', val: PLATFORM },
      { name: 'ownerAddress', op: '=', val: WALLET },
    ];

    beforeEach(function () {
      const queryResponse = [
        { ...SALE_QUERY_DATA, ...overrides },
        { ...GIVEAWAY_QUERY_DATA, ...overrides },
      ];

      runQuerySpy.mockReturnValueOnce([queryResponse] as any);
    });

    it('uses correct query', async () => {

      const expectedQuery = {
        namespace: 'drm',
        kinds: ['item'],
        filters: filters,
      }

      await instance.byWalletAddress(PLATFORM, WALLET);
      expect(runQuerySpy).toHaveBeenCalledTimes(1);
      expect(runQuerySpy).toHaveBeenLastCalledWith(expect.objectContaining(expectedQuery));
    });

    it('transforms results', async () => {
      const results = await instance.byWalletAddress(PLATFORM, WALLET);

      expect(results).toEqual(_transformedResponse(overrides));
    });

    it('ignores deleted items', async () => {
      const queryResponse = [
        { ...SALE_QUERY_DATA, ...overrides, state: 'DELETED' },
        { ...GIVEAWAY_QUERY_DATA, ...overrides, state: 'DELETED' },
      ];

      runQuerySpy.mockReset();
      runQuerySpy.mockReturnValueOnce([queryResponse] as any);

      const results = await instance.byWalletAddress(PLATFORM, WALLET);

      expect(results).toEqual([]);
    });

    it('ignores not minted items', async () => {
      const queryResponse = [
        { ...SALE_QUERY_DATA, ...overrides, nftState: 'UNMINTED' },
        { ...GIVEAWAY_QUERY_DATA, ...overrides, nftState: 'MINTING' },
      ];

      runQuerySpy.mockReset();
      runQuerySpy.mockReturnValueOnce([queryResponse] as any);

      const results = await instance.byWalletAddress(PLATFORM, WALLET);

      expect(results).toEqual([]);
    });

  });

  describe('byUser', () => {

    const overrides = { nftState: 'MINTED', tier: 'GIVEAWAY' };

    const filters = [
      { name: 'platformCode', op: '=', val: PLATFORM },
      { name: 'user', op: '=', val: USER },
    ];

    beforeEach(function () {
      const queryResponse = [
        { ...SALE_QUERY_DATA, ...overrides },
        { ...GIVEAWAY_QUERY_DATA, ...overrides },
      ];

      runQuerySpy.mockReturnValueOnce([queryResponse] as any);
    });

    it('uses correct query', async () => {

      const expectedQuery = {
        namespace: 'drm',
        kinds: ['item'],
        filters: filters,
      }

      await instance.byUser(PLATFORM, USER);
      expect(runQuerySpy).toHaveBeenCalledTimes(1);
      expect(runQuerySpy).toHaveBeenLastCalledWith(expect.objectContaining(expectedQuery));
    });

    it('transforms results', async () => {
      const results = await instance.byUser(PLATFORM, USER);

      expect(results).toEqual(_transformedResponse(overrides));
    });

    it('ignores deleted items', async () => {
      const queryResponse = [
        { ...SALE_QUERY_DATA, ...overrides, state: 'DELETED' },
        { ...GIVEAWAY_QUERY_DATA, ...overrides, state: 'DELETED' },
      ];

      runQuerySpy.mockReset();
      runQuerySpy.mockReturnValueOnce([queryResponse] as any);

      const results = await instance.byUser(PLATFORM, USER);

      expect(results).toEqual([]);
    });

  });

  describe('byThumbprint', () => {

    beforeEach(function () {
      getSpy.mockReturnValueOnce([SALE_QUERY_DATA] as any);
    });

    it('uses correct query', async () => {
      await instance.byThumbprint(PLATFORM, TEST_ENTITIES.v2.sale.key);

      const expectedQuery = {
        namespace: 'drm',
        kind: 'item',
        name: TEST_ENTITIES.v2.sale.key,
      };

      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(getSpy).toHaveBeenLastCalledWith(expect.objectContaining(expectedQuery));
    });

    it('transforms results', async () => {
      const result = await instance.byThumbprint(PLATFORM, TEST_ENTITIES.v2.sale.key);

      expect(result).toEqual(TEST_ENTITIES.v2.sale);
    });

    it('returns null for platform mismatch', async () => {
      const result = await instance.byThumbprint('INVALID', TEST_ENTITIES.v2.sale.key);

      expect(result).toEqual(null);
    });

    it('returns null for DELETED state', async () => {
      getSpy.mockReset();
      getSpy.mockReturnValueOnce([{ ...SALE_QUERY_DATA, state: 'DELETED' }] as any);

      const result = await instance.byThumbprint(PLATFORM, TEST_ENTITIES.v2.sale.key);

      expect(result).toEqual(null);
    });

  });

  describe('byNftAddress', () => {

    beforeEach(function () {
      runQuerySpy.mockReturnValueOnce([[SALE_QUERY_DATA_MINTED]] as any);
    });

    it('uses correct query', async () => {
      await instance.byNftAddress(TEST_ENTITIES.v2.minted.nftAddress as string);

      const expectedQuery = {
        namespace: 'drm',
        kinds: ['item'],
        filters: [{ name: 'nftAddress', op: '=', val: TEST_ENTITIES.v2.minted.nftAddress }],
      };

      expect(runQuerySpy).toHaveBeenCalledTimes(1);
      expect(runQuerySpy).toHaveBeenLastCalledWith(expect.objectContaining(expectedQuery));
    });

    it('transforms results', async () => {
      const result = await instance.byNftAddress(TEST_ENTITIES.v2.minted.nftAddress as string);

      expect(result).toEqual(TEST_ENTITIES.v2.minted);
    });

    it('returns null for DELETED state', async () => {
      runQuerySpy.mockReset();
      runQuerySpy.mockReturnValueOnce([[{ ...SALE_QUERY_DATA_MINTED, state: 'DELETED' }]] as any);

      const result = await instance.byNftAddress(TEST_ENTITIES.v2.minted.nftAddress as string);

      expect(result).toEqual(null);
    });

  });

  describe('findLastIssued', () => {

    beforeEach(function () {
      runQuerySpy.mockReturnValueOnce([[SALE_QUERY_DATA]] as any);
    });

    it('uses correct query', async () => {
      const {platformCode, stockKeepingUnitCode} = TEST_ENTITIES.v2.sale
      await instance.findLastIssued(platformCode, stockKeepingUnitCode);

      const expectedQuery = {
        namespace: 'drm',
        kinds: ['item'],
        filters: [
          { name: 'platformCode', op: '=', val: platformCode },
          { name: 'stockKeepingUnitCode', op: '=', val: stockKeepingUnitCode },
          { name: 'saleQty', op: '!=', val: null }
        ],
        orders: [{ name: 'saleQty', sign: '-'}]

      };

      expect(runQuerySpy).toHaveBeenCalledTimes(1);
      expect(runQuerySpy).toHaveBeenLastCalledWith(expect.objectContaining(expectedQuery));
    });

    it('return null if no results', async () => {
      runQuerySpy.mockReset();
      runQuerySpy.mockReturnValueOnce([[]] as any);

      const {platformCode, stockKeepingUnitCode} = TEST_ENTITIES.v2.sale
      const result = await instance.findLastIssued(platformCode, stockKeepingUnitCode);

      expect(result).toBeNull();
     
    });

    it('transforms results', async () => {
      const {platformCode, stockKeepingUnitCode} = TEST_ENTITIES.v2.sale
      const result = await instance.findLastIssued(platformCode, stockKeepingUnitCode);

      expect(result).toEqual(TEST_ENTITIES.v2.sale);
    });

  })

  describe('countClaimed', () => {

    beforeEach(function () {
      const result = [{ count: 42 }];
      runAggregationQuerySpy.mockReturnValueOnce([result] as any);
    });

    it('uses correct query', async () => {
      const {platformCode, stockKeepingUnitCode} = TEST_ENTITIES.v2.sale
      await instance.countClaimed(platformCode, stockKeepingUnitCode);

      const expectedQuery = {
        filters: [
          {"name": "platformCode", "op": "=", "val": platformCode}, 
          {"name": "stockKeepingUnitCode", "op": "=", "val": stockKeepingUnitCode}, 
          {"name": "claimCode", "op": "!=", "val": null}
        ],
        kinds: ["item"], 
        namespace: "drm", 
      }


      expect(runAggregationQuerySpy).toHaveBeenCalledTimes(1);
      expect(runAggregationQuerySpy).toHaveBeenLastCalledWith(expect.objectContaining({
        query: expect.objectContaining(expectedQuery)
      }));
    })

    it('transforms results', async () => {
      const {platformCode, stockKeepingUnitCode} = TEST_ENTITIES.v2.sale
      const result = await instance.countClaimed(platformCode, stockKeepingUnitCode);

      expect(result).toEqual(42);
    });

  })

  describe('countPurchased', () => {

    beforeEach(function () {
      const result = [{ count: 42 }];
      runAggregationQuerySpy.mockReturnValueOnce([result] as any);
    });

    it('uses correct query', async () => {
      const {platformCode, stockKeepingUnitCode} = TEST_ENTITIES.v2.sale
      await instance.countPurchased(platformCode, stockKeepingUnitCode);

      const expectedQuery = {
        filters: [
          {"name": "platformCode", "op": "=", "val": platformCode}, 
          {"name": "stockKeepingUnitCode", "op": "=", "val": stockKeepingUnitCode}, 
          {"name": "claimCode", "op": "=", "val": null}
        ],
        kinds: ["item"], 
        namespace: "drm", 
      }


      expect(runAggregationQuerySpy).toHaveBeenCalledTimes(1);
      expect(runAggregationQuerySpy).toHaveBeenLastCalledWith(expect.objectContaining({
        query: expect.objectContaining(expectedQuery)
      }));
    })

    it('transforms results', async () => {
      const {platformCode, stockKeepingUnitCode} = TEST_ENTITIES.v2.sale
      const result = await instance.countPurchased(platformCode, stockKeepingUnitCode);

      expect(result).toEqual(42);
    });

  })

});