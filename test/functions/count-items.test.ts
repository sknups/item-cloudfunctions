import './test-env';

import { Request } from '@google-cloud/functions-framework';
import * as MockExpressResponse from 'mock-express-response';
import { countItems } from '../../src';
import { StatusCodes } from 'http-status-codes';
import { ItemRepository } from '../../src/persistence/item-repository';
import { TEST_ENTITIES } from '../test-data-entities';

const instance = countItems;

describe('function - count-item', () => {

  const countClaimed = jest.spyOn(ItemRepository.prototype, 'countClaimed');
  const countPurchased = jest.spyOn(ItemRepository.prototype, 'countPurchased');

  const platform = TEST_ENTITIES.v3.sale.platformCode;
  const sku = TEST_ENTITIES.v3.sale.stockKeepingUnitCode;
  const claimed = 42;
  const purchased = 100;

  let req :Request;

  let res = new MockExpressResponse();

  beforeEach(() => {
    req = {
      method: 'GET',
      path: `/${platform}/${sku}`,
    } as Request;
  
    res = new MockExpressResponse();
    countClaimed.mockReturnValue(Promise.resolve(claimed));
    countPurchased.mockReturnValue(Promise.resolve(purchased));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('asserts \'platform\' and \'sku\' required', async () => {
    req.path = '';

    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res._getString()).toContain('ITEM_00011');
  });

  it('returns 403 Forbidden if called by retailer', async () => {
    req.path = `/retailer/${req.path}`

    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.FORBIDDEN);
  });

  it('returns 405 Method not allowed if method not GET', async () => {
    req.method = 'PUT'

    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.METHOD_NOT_ALLOWED);
  });


  it('ignores path additional element', async () => {
    req.path = `/bla/${req.path}`

    await instance(req, res);

    expect(countClaimed).toHaveBeenCalledTimes(1);
    expect(countClaimed).toHaveBeenLastCalledWith(platform, sku);
  });

  it('returns last issued as internal dto', async () => {
    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.OK);

    expect(countClaimed).toHaveBeenCalledTimes(1);
    expect(countClaimed).toHaveBeenLastCalledWith(platform, sku);
    
    expect(countPurchased).toHaveBeenCalledTimes(1);
    expect(countPurchased).toHaveBeenLastCalledWith(platform, sku);

    expect(res._getJSON()).toEqual({
      claimed,
      purchased,
    });
  });

});
