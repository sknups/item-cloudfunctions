import './test-env';

import * as MockExpressResponse from 'mock-express-response';
import { mockCommitTransactionResponse, mocks } from '../mocks';
import { CreateItemRequestDto } from '../../src/dto/create-item-request.dto';
import { getMockReq } from '@jest-mock/express';
import { createItem } from '../../src';
import { StatusCodes } from 'http-status-codes';
import { ALREADY_EXISTS } from '../../src/persistence/datastore-constants';
import { ItemEntity } from '../../src/entity/item.entity';
import { AuditEntity } from '../../src/entity/audit.entity';
import { ItemEvent } from '../../src/eventstreaming/item-event';

/**
 * Template request for giveaways.
 */
const BODY_GIVEAWAY: CreateItemRequestDto = {
  claimCode: 'claimCode',
  skuCode: 'GIVEAWAY-V3',
  user: 'testUser',
};

/**
 * Template request for sales.
 */
const BODY_PURCHASE: CreateItemRequestDto = {
  skuCode: 'PREMIUM-V3',
  user: 'testUser',
}

/**
 * Sends the given request body the createItem function and handles the response.
 * 
 * @param body the request body
 * @returns the parsed response and mock call data
 */
async function _sendRequest(body: CreateItemRequestDto) {
  const req = getMockReq({ method: 'POST', body });
  const res = new MockExpressResponse();
  await createItem(req, res);

  const itemEntities: ItemEntity[] = mocks.datastoreHelper.insertEntity.mock.calls
    .filter(args => args[1] === 'item')
    .map(args => args[2]);
  const auditEntities: AuditEntity[] = mocks.datastoreHelper.insertEntity.mock.calls
    .filter(args => args[1] === 'audit')
    .map(args => args[2]);
  const events: ItemEvent[] = mocks.eventPublisher.mock.instances
    .map(instance => instance.publishEvent.mock.calls)
    .flat()
    .map(args => args[0] as ItemEvent);

  return {
    rawResponse: res,
    statusCode: res.statusCode,
    dto: res._getJSON(),
    str: res._getString(),
    itemEntities,
    auditEntities,
    events,
  }
}

// The type returned by _sendRequest
type ResponseData = Awaited<ReturnType<typeof _sendRequest>>;

type ResponseExpectations = {
  /* The data we expect to receive in the response */
  dto: ResponseDtoExpectations;

  /* The data we expect to be in the entity */
  entity: EntityExpectations;
}

type ResponseDtoExpectations = {
  claimCode: string | null,
  issue: number | null,
  source: string,
  user: string
}

type EntityExpectations = {
  auditId: number,
  claimCode: string | null,
  saleQty: number | null,
  source: string,
  user: string
}

/**
 * Performs validation on "typical" requests sent to createItem using _sendRequest.
 * 
 * @param res the response received from _sendRequest
 * @param expectations the response expectations
 */
function _validateResponse(
  res: ResponseData,
  expectations: ResponseExpectations,
) {
  expect(res.statusCode).toEqual(StatusCodes.OK);

  expect(res.dto).toEqual(expect.objectContaining({
    issue: expectations.dto.issue
  }));

  expect(res.itemEntities).toHaveLength(1);
  expect(res.itemEntities[0]).toEqual(expect.objectContaining({
    saleQty: expectations.entity.saleQty,
    source: expectations.entity.source,
    user: expectations.entity.user,
  }));

  expect(res.auditEntities).toHaveLength(1);
  expect(res.auditEntities[0].entityId).toEqual(res.itemEntities[0].key);
  expect(res.auditEntities[0].toState).toEqual('UNBOXED / UNMINTED');

  expect(res.events).toHaveLength(1);
  expect(res.events[0]).toEqual(expect.objectContaining({
    claimCode: expectations.entity.claimCode,
    dataEvent: 'CREATE',
    eventId: expectations.entity.auditId.toString(),
    retailUserId: expectations.entity.user,
  }));
}

describe('function - create-item', () => {
  let auditId: number;

  beforeEach(function () {
    mocks.mockClear();
    mocks.datastoreHelper.commitTransaction.mockReset();

    auditId = Math.floor(Math.random() * 10000000000);
    mocks.datastoreHelper.commitTransaction.mockReturnValueOnce(mockCommitTransactionResponse('audit', auditId));
  });

  describe('validation - basic', () => {
    let body: any;

    beforeEach(function () {
      body = { ...BODY_GIVEAWAY };
    });

    it('invalid method returns 405 METHOD_NOT_ALLOWED', async () => {
      const req = getMockReq({ method: 'PUT', body });
      const res = new MockExpressResponse();

      await createItem(req, res);

      expect(res.statusCode).toEqual(StatusCodes.METHOD_NOT_ALLOWED);
    });

    it('empty body returns 400 BAD_REQUEST', async () => {
      const res = await _sendRequest({} as CreateItemRequestDto);

      expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });

    it('missing skuCode returns 400 BAD_REQUEST', async () => {
      delete body.skuCode;
      const res = await _sendRequest(body);

      expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(res.dto.message).toContain('skuCode should not be empty');
    });

    it('empty skuCode returns 400 BAD_REQUEST', async () => {
      body.skuCode = '';
      const res = await _sendRequest(body);

      expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(res.dto.message).toContain('skuCode should not be empty');
    });

    it('numeric skuCode returns 400 BAD_REQUEST', async () => {
      body.skuCode = 1;
      const res = await _sendRequest(body);

      expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(res.dto.message).toContain('skuCode must be a string');
    });

    it('empty user returns 400 BAD_REQUEST', async () => {
      body.user = '';
      const res = await _sendRequest(body);

      expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(res.dto.message).toContain('user should not be empty');
    });

    it('numeric user returns 400 BAD_REQUEST', async () => {
      body.user = 1;
      const res = await _sendRequest(body);

      expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(res.dto.message).toContain('user must be a string');
    });

    it('empty claimCode returns 400 BAD_REQUEST', async () => {
      body.claimCode = '';
      const res = await _sendRequest(body);

      expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(res.dto.message).toContain('claimCode should not be empty');
    });

    it('numeric claimCode returns 400 BAD_REQUEST', async () => {
      body.claimCode = 1;
      const res = await _sendRequest(body);

      expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(res.dto.message).toContain('claimCode must be a string');
    });
  });

  describe('validation - sku', () => {
    it('unknown sku returns 404', async () => {
      const res = await _sendRequest({ ...BODY_GIVEAWAY, skuCode: 'unknown' });

      expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(res.dto.code).toEqual('ITEM_00001');
      expect(mocks.catalog.getSku).toHaveBeenCalledTimes(1);
    });
  });

  describe('validation - giveaway', () => {
    let body: any;

    beforeEach(function () {
      body = { ...BODY_GIVEAWAY };
    });

    it('giveaway v1 without claimCode returns 400 BAD_REQUEST', async () => {
      delete body.claimCode
      const res = await _sendRequest(body);

      expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(res.dto.message).toContain('claimCode is required');
    });

    it('giveaway v2 without claimCode returns 400 BAD_REQUEST', async () => {
      delete body.claimCode
      const res = await _sendRequest(body);

      expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(res.dto.message).toContain('claimCode is required');
      expect(res.dto.code).toEqual('ITEM_00200');
    });

    it('giveaway v3 without claimCode returns 400 BAD_REQUEST', async () => {
      delete body.claimCode
      const res = await _sendRequest(body);

      expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(res.dto.message).toContain('claimCode is required');
      expect(res.dto.code).toEqual('ITEM_00200');
    });
  });

  describe('validation - sale', () => {
    let body: any;

    beforeEach(function () {
      body = { ...BODY_GIVEAWAY };
    });

    it('premium v3 without SELL permission returns 403 FORBIDDEN', async () => {
      const res = await _sendRequest({ ...BODY_PURCHASE, skuCode: 'PREMIUM-V3-WITHOUT-SELL' });

      expect(res.statusCode).toEqual(StatusCodes.FORBIDDEN);
      expect(res.dto.message).toContain('permission SELL does not exist');
      expect(res.dto.code).toEqual('ITEM_00003'); // SKU_PERMISSION_MISSING
    });

    it('sku without stock returns 403 FORBIDDEN', async () => {
      const res = await _sendRequest({ ...BODY_PURCHASE, skuCode: 'PREMIUM-V3-WITHOUT-STOCK' });

      expect(res.statusCode).toEqual(StatusCodes.FORBIDDEN);
      expect(res.dto.code).toEqual('ITEM_00009'); // SKU_STOCK_NOT_INITIALISED

      expect(mocks.catalog.getSku).toHaveBeenCalledTimes(1);
      expect(mocks.stock.updateStock).toHaveBeenCalledTimes(1);
      expect(mocks.datastoreHelper.insertEntity).toHaveBeenCalledTimes(0);
    });

    it('sku with zero stock returns 403 FORBIDDEN', async () => {
      const res = await _sendRequest({ ...BODY_PURCHASE, skuCode: 'PREMIUM-V3-WITH-ZERO-STOCK' });

      expect(res.statusCode).toEqual(StatusCodes.FORBIDDEN);
      expect(res.dto.code).toEqual('ITEM_00008'); // SKU_OUT_OF_STOCK

      expect(mocks.catalog.getSku).toHaveBeenCalledTimes(1);
      expect(mocks.stock.updateStock).toHaveBeenCalledTimes(1);
      expect(mocks.datastoreHelper.insertEntity).toHaveBeenCalledTimes(0);
    });

    it('sku with unexpected error retrieving stock returns 500 INTERNAL_SERVER_ERROR', async () => {
      const res = await _sendRequest({ ...BODY_PURCHASE, skuCode: 'PREMIUM-V3-WITH-STOCK-ERROR' });

      expect(res.dto.code).toEqual('ITEM_00005'); // UPDATE_SKU_STOCK_FAILED
      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);

      expect(mocks.catalog.getSku).toHaveBeenCalledTimes(1);
      expect(mocks.stock.updateStock).toHaveBeenCalledTimes(1);
      expect(mocks.datastoreHelper.insertEntity).toHaveBeenCalledTimes(0);
    });
  });

  describe('edge cases', () => {
    it('duplicate ownershipToken retries and returns 200 OK', async () => {
      mocks.datastoreHelper.insertEntity
        .mockImplementationOnce(() => { throw { code: ALREADY_EXISTS } });

      const res = await _sendRequest(BODY_GIVEAWAY);

      expect(res.statusCode).toEqual(StatusCodes.OK);
      expect(mocks.catalog.getSku).toHaveBeenCalledTimes(1);
      expect(mocks.datastoreHelper.startTransaction).toHaveBeenCalledTimes(2); // once for each try
      expect(mocks.datastoreHelper.rollbackTransaction).toHaveBeenCalledTimes(1); // rolled back failure
      expect(mocks.datastoreHelper.commitTransaction).toHaveBeenCalledTimes(1); // committed success
      expect(mocks.datastoreHelper.insertEntity).toHaveBeenCalledTimes(3); // item x 2, audit

      const mockPublisher = mocks.eventPublisher.mock.instances[0];
      expect(mockPublisher.publishEvent).toHaveBeenCalledTimes(1); // item event published
    });

    it('duplicate ownershipToken retries and returns 500 INTERNAL_SERVER_ERROR after 3 attempts', async () => {
      const alreadyExistsError: any = new Error('mock alreadyExistsError');
      alreadyExistsError.code = ALREADY_EXISTS;

      mocks.datastoreHelper.insertEntity
        .mockImplementationOnce(() => { throw alreadyExistsError })
        .mockImplementationOnce(() => { throw alreadyExistsError })
        .mockImplementationOnce(() => { throw alreadyExistsError });

      const res = await _sendRequest(BODY_PURCHASE);

      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.dto.code).toEqual('ITEM_00100');
      expect(mocks.catalog.getSku).toHaveBeenCalledTimes(1);
      expect(mocks.stock.updateStock).toHaveBeenCalledTimes(1);
      expect(mocks.datastoreHelper.startTransaction).toHaveBeenCalledTimes(3); // once for each try
      expect(mocks.datastoreHelper.rollbackTransaction).toHaveBeenCalledTimes(3); // 3 failures rolled back
      expect(mocks.datastoreHelper.insertEntity).toHaveBeenCalledTimes(3); // item x 3, 0 audit

      const mockPublisher = mocks.eventPublisher.mock.instances[0];
      expect(mockPublisher.publishEvent).toHaveBeenCalledTimes(0); // item event not published
    });
  });

  describe('create giveaway item', () => {
    it('create v1 returns 200 OK', async () => {
      const res = await _sendRequest({ ...BODY_GIVEAWAY, skuCode: 'GIVEAWAY-V1' });

      _validateResponse(res, {
        dto : {
          claimCode: 'claimCode',
          issue: null,
          source: 'GIVEAWAY',
          user: 'testUser',
        },
        entity: {
          auditId,
          claimCode: 'claimCode',
          saleQty: 1000000 - 50123,
          source: 'GIVEAWAY',
          user: 'testUser',
        }
      });
    });

    it('create v2 returns 200 OK', async () => {
      const res = await _sendRequest({ ...BODY_GIVEAWAY, skuCode: 'GIVEAWAY-V2', claimCode: 'claimCode2' });

      _validateResponse(res, {
        dto: {
          claimCode: 'claimCode2',
          issue: null,
          source: 'GIVEAWAY',
          user: 'testUser'
        },
        entity: {
          auditId,
          claimCode: 'claimCode2',
          saleQty: null,
          source: 'GIVEAWAY',
          user: 'testUser'
        }
      });
    });

    it('create v3 returns 200 OK', async () => {
      const res = await _sendRequest({ ...BODY_GIVEAWAY, skuCode: 'GIVEAWAY-V3' });

      _validateResponse(res, {
        dto: {
          claimCode: 'claimCode',
          issue: null,
          source: 'GIVEAWAY',
          user: 'testUser'
        },
        entity: {
          auditId,
          claimCode: 'claimCode',
          saleQty: null,
          source: 'GIVEAWAY',
          user: 'testUser',
        }
      });
    });

    it('create premium v1 returns 200 OK', async () => {
      const res = await _sendRequest({ ...BODY_GIVEAWAY, skuCode: 'PREMIUM-V1' });

      _validateResponse(res, {
        dto: {
          claimCode: 'claimCode',
          issue: 1000 - 371,
          source: 'GIVEAWAY',
          user: 'testUser',
        },
        entity: {
          auditId,
          claimCode: 'claimCode',
          saleQty: 1000 - 371,
          source: 'GIVEAWAY',
          user: 'testUser',
        }
      });
    });

    it('create premium v2 returns 200 OK', async () => {
      const res = await _sendRequest({ ...BODY_GIVEAWAY, skuCode: 'PREMIUM-V2' });

      _validateResponse(res, {
        dto: {
          claimCode: 'claimCode',
          issue: 10000 - 4301,
          source: 'GIVEAWAY',
          user: 'testUser'
        },
        entity: {
          auditId,
          claimCode: 'claimCode',
          saleQty: 10000 - 4301,
          source: 'GIVEAWAY',
          user: 'testUser'
        }
      });
    });

    it('create premium v3 returns 200 OK', async () => {
      const res = await _sendRequest({ ...BODY_GIVEAWAY, skuCode: 'PREMIUM-V3' });

      _validateResponse(res, {
        dto: {
          claimCode: 'claimCode',
          issue: 10000 - 7944,
          source: 'GIVEAWAY',
          user: 'testUser'
        },
        entity: {
          auditId,
          claimCode: 'claimCode',
          saleQty: 10000 - 7944,
          source: 'GIVEAWAY',
          user: 'testUser',
        }
      });
    });
  });

 describe('create purchased item', () => {
   it('create premium v1 returns 200 OK', async () => {
     const res = await _sendRequest({ ...BODY_PURCHASE, skuCode: 'PREMIUM-V1' });

     _validateResponse(res, {
       dto: {
         claimCode: null,
         issue: 1000 - 371,
         source: 'SALE',
         user: 'testUser'
       },
       entity: {
         auditId,
         claimCode: null,
         saleQty: 1000 - 371,
         source: 'SALE',
         user: 'testUser'
       }
     });
   });

   it('create premium v2 returns 200 OK', async () => {
     const res = await _sendRequest({ ...BODY_PURCHASE, skuCode: 'PREMIUM-V2' });

     _validateResponse(res, {
       dto: {
         claimCode: null,
         issue: 10000 - 4301,
         source: 'SALE',
         user: 'testUser'
       },
       entity: {
         auditId,
         claimCode: null,
         saleQty: 10000 - 4301,
         source: 'SALE',
         user: 'testUser'
       }
     });
   });

   it('create premium v3 returns 200 OK', async () => {
     const res = await _sendRequest({ ...BODY_PURCHASE, skuCode: 'PREMIUM-V3', user: 'testUser2' });

     _validateResponse(res, {
       dto: {
         claimCode: null,
         issue: 10000 - 7944,
         source: 'SALE',
         user: 'testUser2'
       },
       entity: {
         auditId,
         claimCode: null,
         saleQty: 10000 - 7944,
         source: 'SALE',
         user: 'testUser2'
       }
     });
   });
  });
});
