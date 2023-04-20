import { getMockReq } from '@jest-mock/express';
import { AbstractCreateItemRequestDto } from '../../src/dto/create-item-request.dto';
import { HttpFunction } from '@google-cloud/functions-framework';
import * as MockExpressResponse from 'mock-express-response';
import { mocks } from '../mocks';
import { ItemEntity } from '../../src/entity/item.entity';
import { AuditEntity } from '../../src/entity/audit.entity';
import { ItemEvent } from '../../src/eventstreaming/item-event';
import { StatusCodes } from 'http-status-codes';

/**
 * Sends the given request body the createItem function and handles the response.
 * 
 * @param body the request body
 * @param entrypoint the cloud function entrypoint
 * @returns the parsed response and mock call data
 */
export async function sendRequest(body: AbstractCreateItemRequestDto, entrypoint: HttpFunction) {
  const req = getMockReq({ method: 'POST', body });
  const res = new MockExpressResponse();
  await entrypoint(req, res);

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

// The type returned by sendRequest
type ResponseData = Awaited<ReturnType<typeof sendRequest>>;

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
 * Performs validation on "typical" requests send to item creating functions using sendRequest.
 * 
 * @param res the response received from sendRequest
 * @param expectations the response expectations
 */
export function validateResponse(
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
