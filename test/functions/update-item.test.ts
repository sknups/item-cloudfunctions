import './test-env';

import { mockCommitTransactionResponse, mocks } from '../mocks';
import { Request } from '@google-cloud/functions-framework';
import * as MockExpressResponse from 'mock-express-response';
import { mocked } from 'jest-mock';
import { updateItem } from '../../src';
import { StatusCodes } from 'http-status-codes';
import { ItemRepository } from '../../src/persistence/item-repository';
import { SALE_ENTITY_FULL } from '../mocks-item';
import { ItemEntity } from '../../src/entity/item.entity';
import { updateEntity } from '../../src/helpers/datastore/datastore.helper';

const SALE_ENTITY_MINTING: ItemEntity = {
  ...SALE_ENTITY_FULL,
  key: 'aaaaaaaaa1',
  nftState: 'MINTING',
  nftAddress: 'SOL.devnet.nft1',
  ownerAddress: 'SOL.devnet.owner1',
}

const instance = updateItem;

describe('function - update-item', () => {

  const byThumbprintSpy = jest.spyOn(ItemRepository.prototype, 'byThumbprint');
  const byNftAddressSpy = jest.spyOn(ItemRepository.prototype, 'byNftAddress');
  const updateItemSpy = jest.spyOn(ItemRepository.prototype, 'updateItem');
  const insertAudit = jest.spyOn(ItemRepository.prototype, 'insertAudit');

  const platform = "SKN";
  const token = "338a6b3128";
  const req = {
    method: 'POST',
    path: `/${platform}/${token}`,
    body: {
      operation: 'MINTING',
      nftAddress: 'SOL.devnet.dummy10',
      ownerAddress: 'SOL.devnet.dummy11',
    },
  } as Request;

  let res = new MockExpressResponse();

  beforeEach(() => {
    mocks.mockClear();
    res = new MockExpressResponse();
    byThumbprintSpy.mockReturnValueOnce(Promise.resolve(SALE_ENTITY_FULL));
    byNftAddressSpy.mockReturnValueOnce(Promise.resolve({
      ...SALE_ENTITY_FULL,
      key: '448a6b3129',
      emailHash: null,
      user: null,
      nftState: 'MINTED',
      nftAddress: 'SOL.devnet.dummy1',
      ownerAddress: 'SOL.devnet.dummy2',
    }));
  });

  afterEach(() => {
    byThumbprintSpy.mockReset();
    byNftAddressSpy.mockReset();
    updateItemSpy.mockReset();
    insertAudit.mockReset();
  });

  it('asserts \'platform\' and \'token\' required', async () => {
    const req = { method: 'POST', path: '' } as Request;

    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res._getString()).toContain('platform code and ownership token (or nft.address) must be provided in path');
  });

  it('ignores path additional element', async () => {
    await instance({ ...req, path: `/bla/${platform}/${token}` } as Request, res);

    expect(byThumbprintSpy).toHaveBeenCalledTimes(1);
    expect(byThumbprintSpy).toHaveBeenLastCalledWith(platform, token, undefined);
    expect(mocks.catalog.getSku).toHaveBeenCalledTimes(1);
    expect(updateItemSpy).toHaveBeenCalledTimes(1);
    expect(insertAudit).toHaveBeenCalledTimes(1);
  });

  it('updates nftState=MINTING and returns item', async () => {
    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(byThumbprintSpy).toHaveBeenCalledTimes(1);
    expect(byThumbprintSpy).toHaveBeenLastCalledWith(platform, token, undefined);
    expect(insertAudit).toHaveBeenCalledTimes(1);

    const json = res._getJSON();
    expect(json.nftState).toEqual('MINTING');
  });

  it('updates nftState=MINTED and publishes event', async () => {
    byThumbprintSpy.mockReset();
    byThumbprintSpy.mockReturnValueOnce(Promise.resolve(SALE_ENTITY_MINTING));
    const auditId: number = Math.floor(Math.random() * 10000000000);
    mocks.datastoreHelper.commitTransaction.mockReturnValueOnce(mockCommitTransactionResponse('audit', auditId));

    await instance({ ...req, body: { operation: 'MINTED' } } as Request, res);

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(byThumbprintSpy).toHaveBeenCalledTimes(1);
    expect(byThumbprintSpy).toHaveBeenLastCalledWith(platform, token, undefined);
    expect(insertAudit).toHaveBeenCalledTimes(1);

    const json = res._getJSON();
    expect(json.nftState).toEqual('MINTED');

    const mockPublisher = mocks.eventPublisher.mock.instances[0];
    expect(mockPublisher.publishEvent).toHaveBeenCalledTimes(1);
    const eventMessage: any = mocked(mockPublisher.publishEvent).mock.calls[0][0];
    expect(eventMessage.eventId).toEqual(`${auditId}`);
    expect(eventMessage.itemCode).toEqual('aaaaaaaaa1');
    expect(eventMessage.dataEvent).toEqual('MINT');
  });

  it('rejects invalid nftState', async () => {
    await instance({ ...req, body: { operation: 'MINTED' } } as Request, res);

    expect(res.statusCode).toEqual(StatusCodes.CONFLICT);

    const json = res._getJSON();
    expect(json.code).toEqual('ITEM_00101');
  });

  it('rejects missing METAPLEX_MINT permission', async () => {
    byThumbprintSpy.mockReset();
    byThumbprintSpy.mockReturnValueOnce(Promise.resolve({ ...SALE_ENTITY_FULL, stockKeepingUnitCode: 'skuWithoutMint' }));
    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.FORBIDDEN);

    const json = res._getJSON();
    expect(json.code).toEqual('ITEM_00003');
  });

  it('returns 404 if item not found', async () => {
    byThumbprintSpy.mockReset();
    byThumbprintSpy.mockReturnValueOnce(Promise.resolve(null));

    await instance(req, res);

    expect(byThumbprintSpy).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(res._getJSON().code).toEqual('ITEM_00102');
  });

});
