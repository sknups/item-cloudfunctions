import './test-env';
import * as MockExpressResponse from 'mock-express-response';
import { mockCommitTransactionResponse, mocks } from '../mocks';
import { getMockReq } from '@jest-mock/express';
import { CreateItemFromGiveawayRequestDto } from '../../src/dto/create-item-request.dto';
import { createItemFromGiveaway } from '../../src';
import { StatusCodes } from 'http-status-codes';
import { ItemEntity } from '../../src/entity/item.entity';
import { AuditEntity } from '../../src/entity/audit.entity';
import { ItemEvent } from '../../src/eventstreaming/item-event';
import { validateString } from '../validation-util';

/**
 * Sends the given request body the createItem function and handles the response.
 * 
 * @param body the request body
 * @returns the parsed response and mock call data
 */
async function _sendRequest(body: CreateItemFromGiveawayRequestDto) {
  const req = getMockReq({ method: 'POST', body });
  const res = new MockExpressResponse();
  await createItemFromGiveaway(req, res);

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
  issue: number | null,
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
  expect(res.statusCode).toEqual(StatusCodes.CREATED);

  expect(res.dto).toEqual(expect.objectContaining({
    issue: expectations.dto.issue
  }));

  expect(res.itemEntities).toHaveLength(1);
  expect(res.itemEntities[0]).toEqual(expect.objectContaining({
    issue: expectations.entity.issue,
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

describe('function - create-item-from-giveaway', () => {

  let auditId: number;

  beforeEach(function () {

    mocks.mockClear();
    mocks.datastoreHelper.commitTransaction.mockReset();

    auditId = Math.floor(Math.random() * 10000000000);
    mocks.datastoreHelper.commitTransaction.mockReturnValueOnce(mockCommitTransactionResponse('audit', auditId));

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

    it('create returns 201 CREATED', async () => {
      const res = await _sendRequest({ sku: 'GIVEAWAY-V3', user: 'testUser' });

      _validateResponse(res, {
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

  });

});
