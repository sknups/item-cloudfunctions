import { Datastore } from '@google-cloud/datastore';
import { ITEM_PROJECTION } from '../../src/entity/item.entity';
import { ItemRepository } from '../../src/persistence/item-repository';
import { NamedKeyEntity } from '../../src/helpers/persistence/base.entity';
import { TEST_ENTITIES } from '../test-data-entities';

const PLATFORM = 'SKN';
const EMAIL = '8b246c38d16a2432ef1b9e3b79279b65d0ba514ad648e99d741d695c66c02fab';
const WALLET = 'SOL.devnet.9H5c7kkULEmT7MvrJp1MEavN1tu7MN5uG5Yigb54D7Vx';
const USER = 'cyP1XYi0y6NadKRXqMbmF9R1vz53';

function _toDatastoreEntity(mappedEntity: NamedKeyEntity): any {
  const result: any = { ...mappedEntity };
  result[Datastore.KEY] = { name: mappedEntity.key };
  delete result.key;
  return result;
}

const SALE_QUERY_DATA_PROJECTED = _toDatastoreEntity(TEST_ENTITIES.v2.sale.projected);
const SALE_QUERY_DATA_MINTED_FULL = _toDatastoreEntity(TEST_ENTITIES.v2.minted.full);
const GIVEAWAY_QUERY_DATA_PROJECTED = _toDatastoreEntity(TEST_ENTITIES.v2.giveaway.projected);

function _runQueryResponse(overrides: object, filterNames: string[]): any {
  const queryResponse = [
    { ...SALE_QUERY_DATA_PROJECTED, ...overrides },
    { ...GIVEAWAY_QUERY_DATA_PROJECTED, ...overrides },
  ];

  queryResponse.forEach(entity => {
    filterNames.forEach(prop => delete entity[prop]);
  });

  return [queryResponse];
}

function _transformedResponse(overrides: object): object[] {
  return [
    { ...TEST_ENTITIES.v2.sale.projected, ...overrides, state: undefined },
    { ...TEST_ENTITIES.v2.giveaway.projected, ...overrides, state: undefined },
  ];
}

describe('persistence', () => {

  const runQuerySpy = jest.spyOn(Datastore.prototype, 'runQuery');
  const getSpy = jest.spyOn(Datastore.prototype, 'get');

  let instance: ItemRepository;

  beforeEach(function () {
    instance = new ItemRepository();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('byEmailHash', () => {

    const overrides = {};

    const filters = [
      { name: 'platformCode', op: '=', val: PLATFORM },
      { name: 'emailHash', op: '=', val: EMAIL },
      { name: 'state', op: '!=', val: 'DELETED' },
    ];

    const filterNames = filters.map(f => f.name);

    beforeEach(function () {
      runQuerySpy.mockReturnValueOnce(_runQueryResponse(overrides, filterNames));
    });

    it('uses correct query', async () => {

      const projection = ITEM_PROJECTION.filter(p => !filterNames.includes(p));

      const expectedQuery = {
        namespace: 'drm',
        kinds: ['item'],
        selectVal: projection,
        filters: filters,
      }

      await instance.byEmailHash(PLATFORM, EMAIL);
      expect(runQuerySpy).toHaveBeenCalledTimes(1);
      expect(runQuerySpy).toHaveBeenLastCalledWith(expect.objectContaining(expectedQuery));
    });

    it('transforms results', async () => {
      const results = await instance.byEmailHash(PLATFORM, EMAIL);

      expect(results).toEqual(_transformedResponse(overrides));
    });

  });


  describe('byWalletAddress', () => {

    const overrides = { nftState: 'MINTED', emailHash: null, ownerAddress: WALLET, user: 'abc432' };

    const filters = [
      { name: 'platformCode', op: '=', val: PLATFORM },
      { name: 'ownerAddress', op: '=', val: WALLET },
      { name: 'nftState', op: '=', val: 'MINTED' },
      { name: 'state', op: '!=', val: 'DELETED' },
    ];

    const filterNames: string[] = filters.map(f => f.name);

    beforeEach(function () {
      const queryResponse = [
        { ...SALE_QUERY_DATA_PROJECTED, ...overrides },
        { ...GIVEAWAY_QUERY_DATA_PROJECTED, ...overrides },
      ];

      queryResponse.forEach(entity => {
        filterNames.forEach(prop => delete entity[prop]);
      });

      runQuerySpy.mockReturnValueOnce([queryResponse] as any);
    });

    it('uses correct query', async () => {

      const projection = ITEM_PROJECTION.filter(p => !filterNames.includes(p));

      const expectedQuery = {
        namespace: 'drm',
        kinds: ['item'],
        selectVal: projection,
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

  });

  describe('byUser', () => {

    const overrides = { nftState: 'MINTED', emailHash: null, tier: 'GIVEAWAY' };

    const filters = [
      { name: 'platformCode', op: '=', val: PLATFORM },
      { name: 'user', op: '=', val: USER },
      { name: 'state', op: '!=', val: 'DELETED' },
    ];

    const filterNames: string[] = filters.map(f => f.name);

    beforeEach(function () {
      const queryResponse = [
        { ...SALE_QUERY_DATA_PROJECTED, ...overrides },
        { ...GIVEAWAY_QUERY_DATA_PROJECTED, ...overrides },
      ];

      queryResponse.forEach(entity => {
        filterNames.forEach(prop => delete entity[prop]);
      });

      runQuerySpy.mockReturnValueOnce([queryResponse] as any);
    });

    it('uses correct query', async () => {

      const projection = ITEM_PROJECTION.filter(p => !filterNames.includes(p));

      const expectedQuery = {
        namespace: 'drm',
        kinds: ['item'],
        selectVal: projection,
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

  });

  describe('byThumbprint', () => {

    beforeEach(function () {
      getSpy.mockReturnValueOnce([SALE_QUERY_DATA_PROJECTED] as any);
    });

    it('uses correct query', async () => {
      await instance.byThumbprint(PLATFORM, TEST_ENTITIES.v2.sale.projected.key);

      const expectedQuery = {
        namespace: 'drm',
        kind: 'item',
        name: TEST_ENTITIES.v2.sale.projected.key,
      };

      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(getSpy).toHaveBeenLastCalledWith(expect.objectContaining(expectedQuery));
    });

    it('transforms results', async () => {
      const result = await instance.byThumbprint(PLATFORM, TEST_ENTITIES.v2.sale.projected.key);

      expect(result).toEqual(TEST_ENTITIES.v2.sale.projected);
    });

    it('returns null for platform mismatch', async () => {
      const result = await instance.byThumbprint('INVALID', TEST_ENTITIES.v2.sale.projected.key);

      expect(result).toEqual(null);
    });

    it('returns null for DELETED state', async () => {
      getSpy.mockReset();
      getSpy.mockReturnValueOnce([{ ...SALE_QUERY_DATA_PROJECTED, state: 'DELETED' }] as any);

      const result = await instance.byThumbprint(PLATFORM, TEST_ENTITIES.v2.sale.projected.key);

      expect(result).toEqual(null);
    });

  });

  describe('byNftAddress', () => {

    beforeEach(function () {
      runQuerySpy.mockReturnValueOnce([[SALE_QUERY_DATA_MINTED_FULL]] as any);
    });

    it('uses correct query', async () => {
      await instance.byNftAddress(TEST_ENTITIES.v2.minted.full.nftAddress as string);

      const expectedQuery = {
        namespace: 'drm',
        kinds: ['item'],
        filters: [{ name: 'nftAddress', op: '=', val: TEST_ENTITIES.v2.minted.full.nftAddress }],
      };

      expect(runQuerySpy).toHaveBeenCalledTimes(1);
      expect(runQuerySpy).toHaveBeenLastCalledWith(expect.objectContaining(expectedQuery));
    });

    it('transforms results', async () => {
      const result = await instance.byNftAddress(TEST_ENTITIES.v2.minted.full.nftAddress as string);

      expect(result).toEqual(TEST_ENTITIES.v2.minted.full);
    });

    it('returns null for DELETED state', async () => {
      runQuerySpy.mockReset();
      runQuerySpy.mockReturnValueOnce([[{ ...SALE_QUERY_DATA_MINTED_FULL, state: 'DELETED' }]] as any);

      const result = await instance.byNftAddress(TEST_ENTITIES.v2.minted.full.nftAddress as string);

      expect(result).toEqual(null);
    });

  });

});
