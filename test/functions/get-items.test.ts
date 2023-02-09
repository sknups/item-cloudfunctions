import './test-env';

import { getItems } from '../../src';
import { Request } from '@google-cloud/functions-framework';
import * as MockExpressResponse from 'mock-express-response';
import { StatusCodes } from 'http-status-codes';
import { ItemRepository } from '../../src/persistence/item-repository';
import { TEST_ENTITIES } from '../test-data-entities';
import { TEST_DTOS } from '../test-data-dtos';

const SALE_ENTITY = TEST_ENTITIES.v2.sale;
const GIVEAWAY_ENTITY = TEST_ENTITIES.v2.giveaway;
const SALE_DTO = TEST_DTOS.v2.sale.retailer;
const GIVEAWAY_DTO = TEST_DTOS.v2.giveaway.retailer;

const instance = getItems;

describe('function - get-items', () => {

  const byWalletAddressSpy = jest.spyOn(ItemRepository.prototype, 'byWalletAddress');
  const byUserSpy = jest.spyOn(ItemRepository.prototype, 'byUser');

  let res = new MockExpressResponse();

  beforeEach(() => {
    res = new MockExpressResponse();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('asserts \'platformCode\' required', async () => {
    const req = { method: 'POST', body: {} } as Request;

    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res._getString()).toContain('platformCode should not be empty');
  });

  it('asserts \'blockchainAddress\' or \'user\' required ', async () => {
    const req = {
      method: 'POST', body: {
        platformCode: 'TEST',
      }
    } as Request;

    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res._getString()).toContain('\'user\' missing. must supply at least user or blockchainAddress');
    expect(res._getString()).toContain('\'blockchainAddress\' missing. must supply at least user or blockchainAddress');
  });

  it('gets items from \'blockchainAddress\' ', async () => {
    const req = {
      method: 'POST', body: {
        platformCode: 'TEST',
        blockchainAddress: 'SOL.devnet.5KNMRFwPbPhhAnxJJby5PDo454rrKDuoHuJf9cNa7XUW'
      }
    } as Request;

    byWalletAddressSpy.mockReturnValueOnce(Promise.resolve([SALE_ENTITY, GIVEAWAY_ENTITY]));

    await instance(req, res);

    const platform = 'TEST';
    const walletAddress = 'SOL.devnet.5KNMRFwPbPhhAnxJJby5PDo454rrKDuoHuJf9cNa7XUW';
    expect(byWalletAddressSpy).toHaveBeenCalledTimes(1);
    expect(byWalletAddressSpy).toHaveBeenLastCalledWith(platform, walletAddress);
    expect(byUserSpy).toHaveBeenCalledTimes(0);

    expect(res._getJSON()).toEqual([SALE_DTO, GIVEAWAY_DTO]);
  });

  it('gets items from \'user\' ', async () => {
    const platform = 'TEST';
    const user = 'abc123456';

    const req = {
      method: 'POST', body: {
        platformCode: platform,
        user: user
      }
    } as Request;

    byUserSpy.mockReturnValueOnce(Promise.resolve([SALE_ENTITY, GIVEAWAY_ENTITY]));

    await instance(req, res);

    expect(byUserSpy).toHaveBeenCalledTimes(1);
    expect(byUserSpy).toHaveBeenLastCalledWith(platform, user);
    expect(byWalletAddressSpy).toHaveBeenCalledTimes(0);

    expect(res._getJSON()).toEqual([SALE_DTO, GIVEAWAY_DTO]);
  });

  it('gets items from \'user\' and \'blockchainAddress\' ', async () => {
    const platform = 'TEST';
    const emailAddress = 'user@example.com';
    const user = 'abc123456';
    const blockchainAddress = 'SOL.devnet.5KNMRFwPbPhhAnxJJby5PDo454rrKDuoHuJf9cNa7XUW';

    const req = {
      method: 'POST', body: {
        platformCode: platform,
        emailAddress,
        user,
        blockchainAddress,
      }
    } as Request;

    byUserSpy.mockReturnValueOnce(Promise.resolve([
      SALE_ENTITY, // duplicate
      { ...GIVEAWAY_ENTITY, key: '111' },
    ]));
    byWalletAddressSpy.mockReturnValueOnce(Promise.resolve([
      { ...SALE_ENTITY, key: '222' },
      { ...GIVEAWAY_ENTITY, key: '333' },
    ]));

    await instance(req, res);

    expect(byUserSpy).toHaveBeenCalledTimes(1);
    expect(byUserSpy).toHaveBeenLastCalledWith(platform, user);
    expect(byWalletAddressSpy).toHaveBeenCalledTimes(1);
    expect(byWalletAddressSpy).toHaveBeenLastCalledWith(platform, blockchainAddress);

    const dto111 = { ...GIVEAWAY_DTO, thumbprint: '111', token: '111' };
    const dto222 = { ...SALE_DTO, thumbprint: '222', token: '222' };
    const dto333 = { ...GIVEAWAY_DTO, thumbprint: '333', token: '333' };

    for (const dto of [dto111, dto222, dto333]) {
      const oldMediaJson = JSON.stringify(dto.media);
      let newMediaJson = oldMediaJson;
      while (newMediaJson.includes('f8d4de3db6') || newMediaJson.includes('fc07c88901')) {
        newMediaJson = newMediaJson.replace(/f8d4de3db6|fc07c88901/, dto.token);
      }
      dto.media = JSON.parse(newMediaJson);
    }

    expect(res._getJSON()).toEqual([
      SALE_DTO,
      dto111,
      dto222,
      dto333,
    ]);
  });

});
