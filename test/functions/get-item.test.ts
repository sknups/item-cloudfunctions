import './test-env';

import { Request } from '@google-cloud/functions-framework';
import * as MockExpressResponse from 'mock-express-response';
import { getItem } from '../../src';
import { StatusCodes } from 'http-status-codes';
import { ItemRepository } from '../../src/persistence/item-repository';
import { TEST_ENTITIES } from '../test-data-entities';
import { TEST_DTOS } from '../test-data-dtos';

const instance = getItem;

describe('function - get-item - retailer', () => {

  const byThumbprintSpy = jest.spyOn(ItemRepository.prototype, 'byThumbprint');

  const platform = "SKN";
  const token = "f8d4de3db6";
  const req = {
    method: 'GET',
    path: `/retailer/${platform}/${token}`,
  } as Request;

  let res = new MockExpressResponse();

  beforeEach(() => {
    res = new MockExpressResponse();
    byThumbprintSpy.mockReturnValueOnce(Promise.resolve(TEST_ENTITIES.v2.sale));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('asserts \'platform\' and \'token\' required', async () => {
    const req = { method: 'GET', path: '' } as Request;

    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res._getString()).toContain('platform code and ownership token (or nft.address) must be provided in path');
  });

  it('ignores path additional element', async () => {
    const req = {
      method: 'GET',
      path: `/retailer/bla/${platform}/${token}`,
    } as Request;

    await instance(req, res);

    expect(byThumbprintSpy).toHaveBeenCalledTimes(1);
    expect(byThumbprintSpy).toHaveBeenLastCalledWith(platform, token);
  });

  it('returns item', async () => {
    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(byThumbprintSpy).toHaveBeenCalledTimes(1);
    expect(byThumbprintSpy).toHaveBeenLastCalledWith(platform, token);
    expect(res._getJSON()).toEqual(TEST_DTOS.v2.sale.retailer);
  });

  it('returns 404 if item not found', async () => {
    byThumbprintSpy.mockReset();
    byThumbprintSpy.mockReturnValueOnce(Promise.resolve(null));

    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(res._getString()).toEqual('Not Found');
  })

});


describe('function - get-item - internal', () => {
  const byThumbprintSpy = jest.spyOn(ItemRepository.prototype, 'byThumbprint');
  const byNftAddressSpy = jest.spyOn(ItemRepository.prototype, 'byNftAddress');

  function req(token: string = 'f8d4de3db6', platform: string = 'SKN') {
    return {
      method: 'GET',
      path: `/${platform}/${token}`,
    } as Request;
  }

  let res = new MockExpressResponse();

  beforeEach(() => {
    res = new MockExpressResponse();
    byThumbprintSpy.mockReturnValueOnce(Promise.resolve(TEST_ENTITIES.v2.sale));
    byNftAddressSpy.mockReturnValueOnce(Promise.resolve(TEST_ENTITIES.v2.minted));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('supports item with null card', async () => {
    byThumbprintSpy.mockReset();
    byThumbprintSpy.mockReturnValueOnce(Promise.resolve({ ...TEST_ENTITIES.v2.sale, card: null }));

    await instance(req(), res);

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(res._getJSON()).toEqual({ ...TEST_DTOS.v2.sale.internal, cardJson: null, media: null});
  });

  it('returns item - sale', async () => {
    await instance(req(), res);

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(byThumbprintSpy).toHaveBeenCalledTimes(1);
    expect(byThumbprintSpy).toHaveBeenLastCalledWith('SKN', 'f8d4de3db6');
    expect(res._getJSON()).toEqual(TEST_DTOS.v2.sale.internal);
  });

  it('returns item - giveaway', async () => {
    byThumbprintSpy.mockReset();
    byThumbprintSpy.mockReturnValueOnce(Promise.resolve(TEST_ENTITIES.v2.giveaway));

    await instance(req('07e6554733'), res);

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(byThumbprintSpy).toHaveBeenCalledTimes(1);
    expect(byThumbprintSpy).toHaveBeenLastCalledWith('SKN', '07e6554733');
    expect(res._getJSON()).toEqual(TEST_DTOS.v2.giveaway.internal);
  });

  it('returns item by nftAddress', async () => {
    const nftAddress = 'SOL.devnet.abc123';

    await instance(req(nftAddress, '_NFT_'), res);

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(byThumbprintSpy).toHaveBeenCalledTimes(0);
    expect(byNftAddressSpy).toHaveBeenCalledTimes(1);
    expect(byNftAddressSpy).toHaveBeenLastCalledWith(nftAddress);
    expect(res._getJSON()).toEqual({
      ...TEST_DTOS.v2.sale.internal,
      token: '309a6b3543',
      nftAddress: 'SOL.devnet.12345',
      nftState: 'MINTED',
      ownerAddress: 'SOL.devnet.67890',
    });
  });
});
