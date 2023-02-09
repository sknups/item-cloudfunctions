// TODO (PLATFORM-3285) delete this test file
/* eslint-disable @typescript-eslint/no-explicit-any */
import './test-env';

import * as MockExpressResponse from 'mock-express-response';
import { mocked } from 'jest-mock';
import { getMockReq } from '@jest-mock/express';
import { StatusCodes } from 'http-status-codes';
import { mockCommitTransactionResponse, mocks } from '../mocks';
import { createEnumeratedItem } from '../../src';
import { ALREADY_EXISTS } from '../../src/persistence/datastore-constants';
import { CreateItemRequestDto } from '../../src/dto/create-item-request.dto';
import { ItemEntity } from '../../src/entity/item.entity';

let body: CreateItemRequestDto = {} as CreateItemRequestDto;
let res = new MockExpressResponse();

describe('function - create-enumerated-item', () => {

  beforeEach(function () {
    mocks.mockClear();
    body = {
      user: 'example',
      skuCode: 'PREMIUM-V2',
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

  it('missing user returns 400', async () => {
    delete (body as any).user;
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
    (body as any).skuCode = 'GIVEAWAY-V2';
    const req = getMockReq({ method: 'POST', body });

    await createEnumeratedItem(req, res);

    expect(res.statusCode).toEqual(StatusCodes.FORBIDDEN);
    expect(res._getJSON().code).toEqual('ITEM_00006'); // SKU_NOT_ENUMERATED
    expect(mocks.catalog.getSku).toHaveBeenCalledTimes(1);
  });

  it('sku without SELL permission returns 403', async () => {
    (body as any).skuCode = 'PREMIUM-V3-WITHOUT-SELL';
    const req = getMockReq({ method: 'POST', body });

    await createEnumeratedItem(req, res);

    expect(res.statusCode).toEqual(StatusCodes.FORBIDDEN);
    expect(res._getJSON().code).toEqual('ITEM_00003');
    expect(mocks.catalog.getSku).toHaveBeenCalledTimes(1);
  });

  it('giveaway v1 sku without claimCode returns 400', async () => {
    (body as any).skuCode = 'GIVEAWAY-V1';
    const req = getMockReq({ method: 'POST', body });

    await createEnumeratedItem(req, res);

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res._getJSON().code).toEqual('ITEM_00200');
    expect(mocks.catalog.getSku).toHaveBeenCalledTimes(1);
  });

  it('sku without stock returns 403', async () => {
    (body as any).skuCode = 'PREMIUM-V3-WITHOUT-STOCK';
    const req = getMockReq({ method: 'POST', body });

    await createEnumeratedItem(req, res);

    expect(res.statusCode).toEqual(StatusCodes.FORBIDDEN);
    expect(res._getJSON().code).toEqual('ITEM_00009');

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

    const item: ItemEntity = mocks.datastoreHelper.insertEntity.mock.calls[0][2];
    expect(item.claimCode).toBeNull();
    expect(item.source).toEqual('SALE');

    const mockPublisher = mocks.eventPublisher.mock.instances[0];
    expect(mockPublisher.publishEvent).toHaveBeenCalledTimes(1); // item event published
    const eventMessage: any = mocked(mockPublisher.publishEvent).mock.calls[0][0];
    expect(eventMessage.eventId).toEqual(`${auditId}`);
    expect(eventMessage.skuCode).toEqual(body.skuCode);
  });

  it('valid giveaway v1 request returns 200', async () => {
    const auditId: number = Math.floor(Math.random() * 10000000000);
    mocks.datastoreHelper.commitTransaction.mockReturnValueOnce(mockCommitTransactionResponse('audit', auditId));

    (body as any).skuCode = 'GIVEAWAY-V1';
    (body as any).claimCode = 'test-claim';
    const req = getMockReq({ method: 'POST', body });

    await createEnumeratedItem(req, res);

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(res._getJSON().issue).toEqual(949877);
    expect(mocks.catalog.getSku).toHaveBeenCalledTimes(1);
    expect(mocks.stock.updateStock).toHaveBeenCalledTimes(1);
    expect(mocks.datastoreHelper.startTransaction).toHaveBeenCalledTimes(1);
    expect(mocks.datastoreHelper.commitTransaction).toHaveBeenCalledTimes(1);
    expect(mocks.datastoreHelper.rollbackTransaction).toHaveBeenCalledTimes(0);
    expect(mocks.datastoreHelper.insertEntity).toHaveBeenCalledTimes(2); // item, audit

    const item: ItemEntity = mocks.datastoreHelper.insertEntity.mock.calls[0][2];
    expect(item.claimCode).toEqual('test-claim');
    expect(item.source).toEqual('GIVEAWAY');

    const mockPublisher = mocks.eventPublisher.mock.instances[0];
    expect(mockPublisher.publishEvent).toHaveBeenCalledTimes(1); // item event published
    const eventMessage: any = mocked(mockPublisher.publishEvent).mock.calls[0][0];
    expect(eventMessage.eventId).toEqual(`${auditId}`);
    expect(eventMessage.skuCode).toEqual(body.skuCode);
  });


  it('sets the sale quantity correctly on an item', async () => {
    const auditId: number = Math.floor(Math.random() * 10000000000);
    mocks.datastoreHelper.commitTransaction.mockReturnValueOnce(mockCommitTransactionResponse('audit', auditId));

    const req = getMockReq({ method: 'POST', body });

    await createEnumeratedItem(req, res);

    expect(mocks.stock.updateStock).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(res._getJSON().saleQty).toEqual(5699);
  });

});
