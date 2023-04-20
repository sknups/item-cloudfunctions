import './test-env';
import * as MockExpressResponse from 'mock-express-response';
import { mockCommitTransactionResponse, mocks } from '../mocks';
import { getMockReq } from '@jest-mock/express';
import { CreateItemFromDropLinkRequestDto } from '../../src/dto/create-item-request.dto';
import { createItemFromDropLink } from '../../src';
import { StatusCodes } from 'http-status-codes';
import { validateString } from '../validation-util';
import { sendRequest, validateResponse } from './create-item-test-util';

function _sendRequest(body: CreateItemFromDropLinkRequestDto) {
  return sendRequest(body, createItemFromDropLink);
}

describe('function - create-item-from-drop-link', () => {

  let auditId: number;

  beforeEach(function () {

    mocks.mockClear();
    mocks.datastoreHelper.commitTransaction.mockReset();

    auditId = Math.floor(Math.random() * 10000000000);
    mocks.datastoreHelper.commitTransaction.mockReturnValueOnce(mockCommitTransactionResponse('audit', auditId));

  });

  describe('validation - basic', () => {

    const template: CreateItemFromDropLinkRequestDto = {
      sku: 'DROPLINK-V3',
      user: 'testUser',
      giveaway: 'dummy-giveaway',
    };

    let body: any;

    beforeEach(function () {
      body = { ...template };
    });

    it('invalid method returns 405 METHOD_NOT_ALLOWED', async () => {
      const req = getMockReq({ method: 'PUT', body });
      const res = new MockExpressResponse();

      await createItemFromDropLink(req, res);

      expect(res.statusCode).toEqual(StatusCodes.METHOD_NOT_ALLOWED);
    });

    it('retailer request returns 403 FORBIDDEN', async () => {
      const req = getMockReq({ method: 'POST', path: '/retailer', body });
      const res = new MockExpressResponse();

      await createItemFromDropLink(req, res);

      expect(res.statusCode).toEqual(StatusCodes.FORBIDDEN);
    });

    it('empty body returns 400 BAD_REQUEST', async () => {
      const res = await _sendRequest({} as CreateItemFromDropLinkRequestDto);

      expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });

    validateString('sku', template, _sendRequest);

    validateString('user', template, _sendRequest);

    validateString('giveaway', template, _sendRequest);

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

    const template: CreateItemFromDropLinkRequestDto = {
      sku: 'DROPLINK-V3',
      user: 'testUser',
      giveaway: 'dummy-giveaway',
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

  });

  describe('item manufacture', () => {

    it('create returns 201 CREATED', async () => {
      const res = await _sendRequest({ sku: 'DROPLINK-V3', user: 'testUser', giveaway: 'dummy-giveaway' });

      validateResponse(res, {
        dto: {
          claimCode: 'dummy-giveaway',
          issue: 467,
          source: 'GIVEAWAY',
          user: 'testUser',
        },
        entity: {
          auditId,
          claimCode: 'dummy-giveaway',
          issue: 467,
          source: 'GIVEAWAY',
          user: 'testUser',
        }
      });
    });

  });

});
