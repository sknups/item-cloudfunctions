/* eslint-disable @typescript-eslint/no-explicit-any */
import './test-env';

import * as MockExpressResponse from 'mock-express-response';
import { mocked } from 'jest-mock';
import { getMockReq } from '@jest-mock/express';
import { StatusCodes } from 'http-status-codes';
import { mockCommitTransactionResponse, mocks } from '../mocks';
import { createEnumeratedItem } from '../../src';
import { ALREADY_EXISTS } from '../../src/persistence/datastore-constants';
import { CreateEnumeratedItemRequestDTO } from '../../src/dto/create-enumerated-item-request.dto';

let body: CreateEnumeratedItemRequestDTO = {} as CreateEnumeratedItemRequestDTO;
let res = new MockExpressResponse();

describe('function - create-enumerated-item', () => {

  beforeEach(function () {
    mocks.mockClear();
    body = {
      email: 'email@example.com',
      skuCode: 'premiumSku',
    };
    res = new MockExpressResponse();
  });

  it('invalid method returns 405', async () => {
    const req = getMockReq({ method: 'PUT', body });

    await createEnumeratedItem(req, res);

    expect(res.statusCode).toEqual(StatusCodes.METHOD_NOT_ALLOWED);
  });

  it('empty body returns 400', async () => {
    const req = getMockReq({ method: 'POST', body: {} });

    await createEnumeratedItem(req, res);

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
  });

  it('missing email returns 400', async () => {
    delete (body as any).email;
    const req = getMockReq({ method: 'POST', body });

    await createEnumeratedItem(req, res);

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
  });

  it('invalid email returns 400', async () => {
    (body as any).email = 'invalid-email';
    const req = getMockReq({ method: 'POST', body });

    await createEnumeratedItem(req, res);

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
  });

  it('missing skuCode returns 400', async () => {
    delete (body as any).skuCode;
    const req = getMockReq({ method: 'POST', body });

    await createEnumeratedItem(req, res);

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
  });

  it('unknown sku returns 404', async () => {
    (body as any).skuCode = 'unknown';
    const req = getMockReq({ method: 'POST', body });

    await createEnumeratedItem(req, res);

    expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(res._getJSON().code).toEqual('ITEM_00001');
    expect(mocks.catalog.getSku).toHaveBeenCalledTimes(1);
  });

  it('skus with null maxQty returns 403', async () => {
    (body as any).skuCode = 'premiumSkuWithoutMaxQty';
    const req = getMockReq({ method: 'POST', body });

    await createEnumeratedItem(req, res);

    expect(res.statusCode).toEqual(StatusCodes.FORBIDDEN);
    expect(res._getJSON().code).toEqual('ITEM_00004');
    expect(mocks.catalog.getSku).toHaveBeenCalledTimes(1);
  });

  it('sku without SELL permission returns 403', async () => {
    (body as any).skuCode = 'premiumSkuWithoutSellPermission';
    const req = getMockReq({ method: 'POST', body });

    await createEnumeratedItem(req, res);

    expect(res.statusCode).toEqual(StatusCodes.FORBIDDEN);
    expect(res._getJSON().code).toEqual('ITEM_00004');
    expect(mocks.catalog.getSku).toHaveBeenCalledTimes(1);
  });

  it('sku without stock returns 403', async () => {
    (body as any).skuCode = 'premiumSkuNoStock';
    const req = getMockReq({ method: 'POST', body });

    await createEnumeratedItem(req, res);

    expect(res.statusCode).toEqual(StatusCodes.FORBIDDEN);
    expect(res._getJSON().code).toEqual('ITEM_00005');

    expect(mocks.catalog.getSku).toHaveBeenCalledTimes(1);
    expect(mocks.stock.updateStock).toHaveBeenCalledTimes(1);
    expect(mocks.datastoreHelper.insertEntity).toHaveBeenCalledTimes(0);
  });

  it('duplicate ownershipToken retries and returns 200', async () => {
    const auditId: number = Math.floor(Math.random() * 10000000000);
    mocks.datastoreHelper.commitTransaction.mockReturnValueOnce(mockCommitTransactionResponse('audit', auditId));

    const req = getMockReq({ method: 'POST', body });

    mocks.datastoreHelper.insertEntity
      .mockImplementationOnce(() => { throw { code: ALREADY_EXISTS } });

    await createEnumeratedItem(req, res);

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(mocks.catalog.getSku).toHaveBeenCalledTimes(1);
    expect(mocks.stock.updateStock).toHaveBeenCalledTimes(1);
    expect(mocks.datastoreHelper.startTransaction).toHaveBeenCalledTimes(2); // once for each try
    expect(mocks.datastoreHelper.rollbackTransaction).toHaveBeenCalledTimes(1); // rolled back failure
    expect(mocks.datastoreHelper.commitTransaction).toHaveBeenCalledTimes(1); // committed success
    expect(mocks.datastoreHelper.insertEntity).toHaveBeenCalledTimes(3); // item x 2, audit

    const mockPublisher = mocks.eventPublisher.mock.instances[0];
    expect(mockPublisher.publishEvent).toHaveBeenCalledTimes(1); // item event published
  });

  it('duplicate ownershipToken retries and fails after 3 attempts', async () => {
    const req = getMockReq({ method: 'POST', body });

    const alreadyExistsError: any = new Error('mock alreadyExistsError');
    alreadyExistsError.code = ALREADY_EXISTS;

    mocks.datastoreHelper.insertEntity
      .mockImplementationOnce(() => { throw alreadyExistsError })
      .mockImplementationOnce(() => { throw alreadyExistsError })
      .mockImplementationOnce(() => { throw alreadyExistsError });

    await createEnumeratedItem(req, res);

    expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res._getJSON().code).toEqual('ITEM_00100');
    expect(mocks.catalog.getSku).toHaveBeenCalledTimes(1);
    expect(mocks.stock.updateStock).toHaveBeenCalledTimes(1);
    expect(mocks.datastoreHelper.startTransaction).toHaveBeenCalledTimes(3); // once for each try
    expect(mocks.datastoreHelper.rollbackTransaction).toHaveBeenCalledTimes(3); // 3 failures rolled back
    expect(mocks.datastoreHelper.insertEntity).toHaveBeenCalledTimes(3); // item x 3, 0 audit

    const mockPublisher = mocks.eventPublisher.mock.instances[0];
    expect(mockPublisher.publishEvent).toHaveBeenCalledTimes(0); // item event published
  });

  it('valid request returns 200', async () => {
    const auditId: number = Math.floor(Math.random() * 10000000000);
    mocks.datastoreHelper.commitTransaction.mockReturnValueOnce(mockCommitTransactionResponse('audit', auditId));

    const req = getMockReq({ method: 'POST', body });

    await createEnumeratedItem(req, res);

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(mocks.catalog.getSku).toHaveBeenCalledTimes(1);
    expect(mocks.stock.updateStock).toHaveBeenCalledTimes(1);
    expect(mocks.datastoreHelper.startTransaction).toHaveBeenCalledTimes(1);
    expect(mocks.datastoreHelper.commitTransaction).toHaveBeenCalledTimes(1);
    expect(mocks.datastoreHelper.rollbackTransaction).toHaveBeenCalledTimes(0);
    expect(mocks.datastoreHelper.insertEntity).toHaveBeenCalledTimes(2); // item, audit

    const mockPublisher = mocks.eventPublisher.mock.instances[0];
    expect(mockPublisher.publishEvent).toHaveBeenCalledTimes(1); // item event published
    const eventMessage: any = mocked(mockPublisher.publishEvent).mock.calls[0][0];
    expect(eventMessage.eventId).toEqual(`${auditId}`);
    expect(eventMessage.skuCode).toEqual(body.skuCode);
  });

});
