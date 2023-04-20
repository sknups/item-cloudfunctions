import './test-env';
import * as MockExpressResponse from 'mock-express-response';
import { mockCommitTransactionResponse, mocks } from '../mocks';
import { getMockReq } from '@jest-mock/express';
import { CreateItemFromPurchaseRequestDto } from '../../src/dto/create-item-request.dto';
import { createItemFromPurchase } from '../../src';
import { StatusCodes } from 'http-status-codes';
import { validateString } from '../validation-util';
import { sendRequest, validateResponse } from './create-item-test-util';

function _sendRequest(body: CreateItemFromPurchaseRequestDto) {
  return sendRequest(body, createItemFromPurchase);
}

describe('function - create-item-from-purchase', () => {

  let auditId: number;

  beforeEach(function () {

    mocks.mockClear();
    mocks.datastoreHelper.commitTransaction.mockReset();

    auditId = Math.floor(Math.random() * 10000000000);
    mocks.datastoreHelper.commitTransaction.mockReturnValueOnce(mockCommitTransactionResponse('audit', auditId));

  });

  describe('validation - basic', () => {

    const template: CreateItemFromPurchaseRequestDto = {
      sku: 'PREMIUM-V3',
      user: 'testUser',
      transaction: 'dummy-transaction',
    };

    let body: any;

    beforeEach(function () {
      body = { ...template };
    });

    it('invalid method returns 405 METHOD_NOT_ALLOWED', async () => {
      const req = getMockReq({ method: 'PUT', body });
      const res = new MockExpressResponse();

      await createItemFromPurchase(req, res);

      expect(res.statusCode).toEqual(StatusCodes.METHOD_NOT_ALLOWED);
    });

    it('empty body returns 400 BAD_REQUEST', async () => {
      const res = await _sendRequest({} as CreateItemFromPurchaseRequestDto);

      expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });

    validateString('sku', template, _sendRequest);

    validateString('user', template, _sendRequest);

    validateString('transaction', template, _sendRequest);

    it('defined claimCode returns 400 BAD_REQUEST', async () => {
      body.claimCode = 'anything';
      const res = await _sendRequest(body);

      expect(res.dto.message).toContain('claimCode must be equal to undefined');
      expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });

    it('valid request returns 201 CREATED', async () => {
      const res = await _sendRequest(body);

      expect(res.statusCode).toEqual(StatusCodes.CREATED);
    });

  });

  describe('validation - sku', () => {

    const template: CreateItemFromPurchaseRequestDto = {
      sku: 'PREMIUM-V3',
      user: 'testUser',
      transaction: 'dummy-transaction',
    };

    let body: any;

    beforeEach(function () {
      body = { ...template };
    });

    it('claimable SKU returns 403 FORBIDDEN', async () => {
      body.sku = 'GIVEAWAY-V3';
      const res = await _sendRequest(body);

      expect(res.dto.message).toContain('claimable attribute is set');
      expect(res.dto.code).toEqual('ITEM_00003');
      expect(res.statusCode).toEqual(StatusCodes.FORBIDDEN);
    });

    it('SKU without price returns 403 FORBIDDEN', async () => {
      body.sku = 'PREMIUM-V3-WITHOUT-PRICE';
      const res = await _sendRequest(body);

      expect(res.dto.message).toContain('price is not set');
      expect(res.dto.code).toEqual('ITEM_00003');
      expect(res.statusCode).toEqual(StatusCodes.FORBIDDEN);
    });

    it('non-enumerated SKU returns 403 FORBIDDEN', async () => {
      body.sku = 'PREMIUM-V3-WITHOUT-ENUMERATION';
      const res = await _sendRequest(body);

      expect(res.dto.message).toContain('is not enumerated');
      expect(res.dto.code).toEqual('ITEM_00003');
      expect(res.statusCode).toEqual(StatusCodes.FORBIDDEN);
    });

  });

  describe('item manufacture', () => {

    it('create returns 201 CREATED', async () => {
      const res = await _sendRequest({ sku: 'PREMIUM-V3', user: 'testUser', transaction: 'dummy-transaction' });

      validateResponse(res, {
        dto: {
          claimCode: null,
          issue: 2056,
          source: 'SALE',
          user: 'testUser',
        },
        entity: {
          auditId,
          claimCode: null,
          issue: 2056,
          source: 'SALE',
          user: 'testUser',
        }
      });
    });

  });

});
