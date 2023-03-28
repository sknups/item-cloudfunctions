import './test-env';

import { Request } from '@google-cloud/functions-framework';
import * as MockExpressResponse from 'mock-express-response';
import { findLastIssued } from '../../src';
import { StatusCodes } from 'http-status-codes';
import { ItemRepository } from '../../src/persistence/item-repository';
import { TEST_DTOS } from '../test-data-dtos';
import { TEST_ENTITIES } from '../test-data-entities';

const instance = findLastIssued;

describe('function - find-last-issued', () => {

  const findLastIssued = jest.spyOn(ItemRepository.prototype, 'findLastIssued');

  const platform = TEST_ENTITIES.v3.sale.platformCode;
  const sku = TEST_ENTITIES.v3.sale.stockKeepingUnitCode;

  let req :Request;

  let res = new MockExpressResponse();

  beforeEach(() => {
    req = {
      method: 'GET',
      path: `/${platform}/${sku}`,
    } as Request;
  
    res = new MockExpressResponse();
    findLastIssued.mockReturnValue(Promise.resolve(TEST_ENTITIES.v3.sale));
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

  it('returns 404 Forbidden if called by retailer', async () => {
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

    expect(findLastIssued).toHaveBeenCalledTimes(1);
    expect(findLastIssued).toHaveBeenLastCalledWith(platform, sku);
  });

  it('returns 404 if no item found', async () => {
    findLastIssued.mockReturnValue(Promise.resolve(null));
    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
  });

  it('returns last issued as internal dto', async () => {
    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(findLastIssued).toHaveBeenCalledTimes(1);
    expect(findLastIssued).toHaveBeenLastCalledWith(platform, sku);
    expect(res._getJSON()).toEqual({ ...TEST_DTOS.v3.sale.internal});
  });

});
