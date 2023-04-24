import './test-env';
import * as MockExpressResponse from 'mock-express-response';
import { mockCommitTransactionResponse, mocks } from '../mocks';
import { getMockReq } from '@jest-mock/express';
import { CreateItemFromGiveawayRequestDto } from '../../src/dto/create-item-request.dto';
import { createItemFromGiveaway } from '../../src';
import { StatusCodes } from 'http-status-codes';
import { ItemEntity } from '../../src/entity/item.entity';
import { validateString } from '../validation-util';
import { ItemRepository } from '../../src/persistence/item-repository';
import { GIVEAWAY_ENTITY_V3 } from '../test-data-entities';
import { sendRequest, validateResponse } from './create-item-test-util';

function _sendRequest(body: CreateItemFromGiveawayRequestDto) {
  return sendRequest(body, createItemFromGiveaway);
}

describe('function - create-item-from-giveaway', () => {

  let auditId: number;
  let bySkuAndUserSpy = jest.spyOn(ItemRepository.prototype, 'bySkuAndUser');

  beforeEach(function () {

    mocks.mockClear();
    mocks.datastoreHelper.commitTransaction.mockReset();

    auditId = Math.floor(Math.random() * 10000000000);
    mocks.datastoreHelper.commitTransaction.mockReturnValueOnce(mockCommitTransactionResponse('audit', auditId));

    bySkuAndUserSpy.mockClear();
    bySkuAndUserSpy.mockReturnValueOnce(Promise.resolve([]));

  });

  describe('validation - basic', () => {

    const template: CreateItemFromGiveawayRequestDto = {
      sku: 'GIVEAWAY-V3',
      user: 'testUser',
    };

    let body: any;

    beforeEach(function () {
      body = { ...template };
    });

    it('invalid method returns 405 METHOD_NOT_ALLOWED', async () => {
      const req = getMockReq({ method: 'PUT', body });
      const res = new MockExpressResponse();

      await createItemFromGiveaway(req, res);

      expect(res.statusCode).toEqual(StatusCodes.METHOD_NOT_ALLOWED);
    });

    it('empty body returns 400 BAD_REQUEST', async () => {
      const res = await _sendRequest({} as CreateItemFromGiveawayRequestDto);

      expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });

    validateString('sku', template, _sendRequest);

    validateString('user', template, _sendRequest);

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

    const template: CreateItemFromGiveawayRequestDto = {
      sku: 'GIVEAWAY-V3',
      user: 'testUser',
    };

    let body: any;

    beforeEach(function () {
      body = { ...template };
    });

    it('non-claimable SKU returns 403 FORBIDDEN', async () => {
      body.sku = 'PREMIUM-V3';
      const res = await _sendRequest(body);

      expect(res.dto.message).toContain('claimable attribute not set');
      expect(res.dto.code).toEqual('ITEM_00003');
      expect(res.statusCode).toEqual(StatusCodes.FORBIDDEN);
    });

    it('premium SKU returns 403 FORBIDDEN', async () => {
      body.sku = 'PREMIUM-V3-CLAIMABLE';
      const res = await _sendRequest(body);

      expect(res.dto.message).toContain('price is set');
      expect(res.dto.code).toEqual('ITEM_00003');
      expect(res.statusCode).toEqual(StatusCodes.FORBIDDEN);
    });

    it('enumerated SKU returns 403 FORBIDDEN', async () => {
      body.sku = 'DROPLINK-V3-CLAIMABLE';
      const res = await _sendRequest(body);

      expect(res.dto.message).toContain('it is enumerated');
      expect(res.dto.code).toEqual('ITEM_00003');
      expect(res.statusCode).toEqual(StatusCodes.FORBIDDEN);
    });

  });

  describe('item manufacture', () => {

    beforeEach(function () {
      bySkuAndUserSpy.mockReset();
      bySkuAndUserSpy.mockImplementation((sku: string, user: string): Promise<ItemEntity[]> => {
        if (sku === 'GIVEAWAY-V3' && user === 'testUserWithItem') {
          return Promise.resolve([{
            ...GIVEAWAY_ENTITY_V3,
            stockKeepingUnitCode: 'GIVEAWAY-V3',
            user: 'testUserWithItem'
          } as ItemEntity]);
        }

        return Promise.resolve([]);
      })

    });

    it('create returns 201 CREATED if user does not have item for sku', async () => {
      const res = await _sendRequest({ sku: 'GIVEAWAY-V3', user: 'testUser' });

      validateResponse(res, {
        dto: {
          claimCode: null,
          issue: null,
          source: 'GIVEAWAY',
          user: 'testUser',
        },
        entity: {
          auditId,
          claimCode: null,
          issue: null,
          source: 'GIVEAWAY',
          user: 'testUser',
        }
      });
    });

    it('create returns existing item if user already has item for sku', async () => {
      const res = await _sendRequest({ sku: 'GIVEAWAY-V3', user: 'testUserWithItem' });

      expect(res.statusCode).toEqual(StatusCodes.OK);
      expect(res.dto).toEqual(expect.objectContaining({
        token: 'ecd5aa6b03',
      }));

      expect(res.itemEntities).toHaveLength(0);
      expect(res.auditEntities).toHaveLength(0);
      expect(res.events).toHaveLength(0);
    });

  });

});
