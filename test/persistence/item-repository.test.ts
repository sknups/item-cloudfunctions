import { Datastore } from '@google-cloud/datastore';
import { ITEM_PROJECTION } from '../../src/entity/item.entity';
import { ItemRepository } from '../../src/persistence/item-repository';
import { SALE_ENTITY, GIVEAWAY_ENTITY, SALE_ENTITY_MINTED } from '../mocks-item';

const PLATFORM = 'TEST';
const EMAIL = '495a8c7b1ab6fd611377ba81fe75cdead63f0ebe88a9260806a3fba790400805';
const WALLET = 'SOL.devnet.9H5c7kkULEmT7MvrJp1MEavN1tu7MN5uG5Yigb54D7Vx';
const USER = 'abc123';

const SALE_QUERY_DATA = {
  [Datastore.KEY]: { name: '338a6b3128' },
  saleQty: 14,
  maxQty: 10000,
  source: "SALE",
  nftState: "UNMINTED",
  claimCode: null,
  stockKeepingUnitName: "Common Octahedron",
  description: "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
  brandCode: "TEST",
  stockKeepingUnitCode: "TEST-OCTAHEDRON-COMMON",
  tier: "GREEN",
  recommendedRetailPrice: 100,
  user: 'abc123',
  created: 1657622239335000,
  card: '{"back": {"token": {"color": "#FFFFFFFF","font-size": "25pt","font-family": "ShareTechMono-Regular","font-weight": "Regular","x": 470,"y": 340}}}',
  stockKeepingUnitRarity: null,
  version: "1",
  skn: "STATIC",
  emailHash: '495a8c7b1ab6fd611377ba81fe75cdead63f0ebe88a9260806a3fba790400805',
  platformCode: 'TEST',
  ownerAddress: null,
  state: 'UNBOXED',
  media: '{}'
};

const SALE_QUERY_DATA_FULL = {
  ...SALE_QUERY_DATA,
  updated: SALE_QUERY_DATA.created,
  brandName: 'TEST',
  brandWholesalePrice: 80,
  brandWholesalerShare: 50,
  nftAddress: null,
}

const SALE_QUERY_DATA_MINTED = {
  ...SALE_QUERY_DATA_FULL,
  nftState: 'MINTED',
  nftAddress: SALE_ENTITY_MINTED.nftAddress,
  ownerAddress: SALE_ENTITY_MINTED.ownerAddress,
}

const GIVEAWAY_QUERY_DATA = {
  [Datastore.KEY]: { name: '07e6554733' },
  saleQty: 8,
  maxQty: 100,
  source: "GIVEAWAY",
  nftState: "UNMINTED",
  claimCode: "claim-123",
  stockKeepingUnitName: "Rare Cube",
  description: "The only regular solid which tessellates Euclidean space: the hexahedron.  The ancients believed this caused the solidity of the Earth.",
  brandCode: "TEST",
  stockKeepingUnitCode: "TEST-CUBE-RARE",
  tier: "GREEN",
  recommendedRetailPrice: 1000,
  user: 'abc123',
  created: 1654013672253000,
  card: null,
  stockKeepingUnitRarity: null,
  version: "1",
  skn: "STATIC",
  emailHash: '495a8c7b1ab6fd611377ba81fe75cdead63f0ebe88a9260806a3fba790400805',
  platformCode: 'TEST',
  ownerAddress: null,
  state: 'UNBOXED',
  media: '{}'
};

function _runQueryResponse(overrides: object, filterNames: string[]): any {
  const queryResponse = [
    { ...SALE_QUERY_DATA, ...overrides },
    { ...GIVEAWAY_QUERY_DATA, ...overrides },
  ];

  queryResponse.forEach(entity => {
    filterNames.forEach(prop => delete entity[prop]);
  });

  return [queryResponse];
}

function _transformedResponse(overrides: object): object[] {
  return [
    { ...SALE_ENTITY, ...overrides, state: undefined },
    { ...GIVEAWAY_ENTITY, ...overrides, state: undefined },
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
        { ...SALE_QUERY_DATA, ...overrides },
        { ...GIVEAWAY_QUERY_DATA, ...overrides },
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
        { ...SALE_QUERY_DATA, ...overrides },
        { ...GIVEAWAY_QUERY_DATA, ...overrides },
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
      getSpy.mockReturnValueOnce([SALE_QUERY_DATA] as any);
    });

    it('uses correct query', async () => {
      await instance.byThumbprint(PLATFORM, SALE_ENTITY.key);

      const expectedQuery = {
        namespace: 'drm',
        kind: 'item',
        name: SALE_ENTITY.key,
      };

      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(getSpy).toHaveBeenLastCalledWith(expect.objectContaining(expectedQuery));
    });

    it('transforms results', async () => {
      const result = await instance.byThumbprint(PLATFORM, SALE_ENTITY.key);

      expect(result).toEqual(SALE_ENTITY);
    });

    it('returns null for platform mismatch', async () => {
      const result = await instance.byThumbprint('INVALID', SALE_ENTITY.key);

      expect(result).toEqual(null);
    });

    it('returns null for DELETED state', async () => {
      getSpy.mockReset();
      getSpy.mockReturnValueOnce([{ ...SALE_QUERY_DATA, state: 'DELETED' }] as any);

      const result = await instance.byThumbprint(PLATFORM, SALE_ENTITY.key);

      expect(result).toEqual(null);
    });

  });

  describe('byNftAddress', () => {

    beforeEach(function () {
      runQuerySpy.mockReturnValueOnce([[SALE_QUERY_DATA_MINTED]] as any);
    });

    it('uses correct query', async () => {
      await instance.byNftAddress(SALE_ENTITY_MINTED.nftAddress as string);

      const expectedQuery = {
        namespace: 'drm',
        kinds: ['item'],
        filters: [{ name: 'nftAddress', op: '=', val: SALE_ENTITY_MINTED.nftAddress }],
      };

      expect(runQuerySpy).toHaveBeenCalledTimes(1);
      expect(runQuerySpy).toHaveBeenLastCalledWith(expect.objectContaining(expectedQuery));
    });

    it('transforms results', async () => {
      const result = await instance.byNftAddress(SALE_ENTITY_MINTED.nftAddress as string);

      expect(result).toEqual(SALE_ENTITY_MINTED);
    });

    it('returns null for DELETED state', async () => {
      runQuerySpy.mockReset();
      runQuerySpy.mockReturnValueOnce([[{ ...SALE_QUERY_DATA_MINTED, state: 'DELETED' }]] as any);

      const result = await instance.byNftAddress(SALE_ENTITY_MINTED.nftAddress as string);

      expect(result).toEqual(null);
    });

  });

});
