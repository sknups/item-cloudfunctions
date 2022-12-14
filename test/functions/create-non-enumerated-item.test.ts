/* eslint-disable @typescript-eslint/no-explicit-any */
process.env.LOG_FORMAT = 'simple';
process.env.LOG_LEVEL = 'warn';
process.env.GCLOUD_PROJECT = 'local';
process.env.GCLOUD_REGION = 'europe-west1';
process.env.EMAIL_HASHING_SECRET = '#oBbMZrt56ti';
process.env.FLEX_URL = 'https://flex-dev.sknups.gg';
process.env.SKNAPP_URL = 'https://app-dev.sknups.gg';
process.env.ASSETS_HOST = 'https://assets-dev.sknups.gg';
process.env.FLEX_HOST = 'https://flex-dev.sknups.gg';
process.env.SKNAPP_HOST = 'https://app-dev.sknups.gg';


import * as MockExpressResponse from 'mock-express-response';
import { mocked } from 'jest-mock';
import { getMockReq } from '@jest-mock/express';
import { StatusCodes } from 'http-status-codes';
import { CreateNonEnumeratedItemRequestDTO } from '../../src/dto/create-non-enumerated-item-request.dto';
import { mockDatastoreCommitResponse, mocks } from '../mocks';
import { createNonEnumeratedItem } from '../../src';
import { ALREADY_EXISTS } from '../../src/persistence/datastore-constants';

let body: CreateNonEnumeratedItemRequestDTO = {} as CreateNonEnumeratedItemRequestDTO;
let res = new MockExpressResponse();

describe('function - create-giveaway-item', () => {

    beforeEach(function () {
        mocks.mockClear();
        body = {
            claimCode: 'claimCode',
            email: 'email@example.com',
            skuCode: 'skuCode',
        };
        res = new MockExpressResponse();
    });

    it('invalid method returns 405', async () => {
        const req = getMockReq({ method: 'PUT', body });

        await createNonEnumeratedItem(req, res);

        expect(res.statusCode).toEqual(StatusCodes.METHOD_NOT_ALLOWED);
    });

    it('empty body returns 400', async () => {
        const req = getMockReq({ method: 'POST', body: {} });

        await createNonEnumeratedItem(req, res);

        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });

    it('missing claimCode returns 400', async () => {
        delete (body as any).claimCode;
        const req = getMockReq({ method: 'POST', body });

        await createNonEnumeratedItem(req, res);

        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });

    it('missing email returns 400', async () => {
        delete (body as any).email;
        const req = getMockReq({ method: 'POST', body });

        await createNonEnumeratedItem(req, res);

        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });

    it('invalid email returns 400', async () => {
        (body as any).email = 'invalid-email';
        const req = getMockReq({ method: 'POST', body });

        await createNonEnumeratedItem(req, res);

        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });

    it('missing skuCode returns 400', async () => {
        delete (body as any).skuCode;
        const req = getMockReq({ method: 'POST', body });

        await createNonEnumeratedItem(req, res);

        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });

    it('unknown sku returns 404', async () => {
        (body as any).skuCode = 'unknown';
        const req = getMockReq({ method: 'POST', body });

        await createNonEnumeratedItem(req, res);

        expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(res._getJSON().code).toEqual('CREATE_NON_ENUMERATED_ITEM_00001');
        expect(mocks.datastoreRepository.getEntity).toHaveBeenCalledTimes(1); // get catalog.sku
    });

    it('v1 sku returns 403', async () => {
        (body as any).skuCode = 'skuv1';
        const req = getMockReq({ method: 'POST', body });

        await createNonEnumeratedItem(req, res);

        expect(res.statusCode).toEqual(StatusCodes.FORBIDDEN);
        expect(res._getJSON().code).toEqual('CREATE_NON_ENUMERATED_ITEM_00002');
        expect(mocks.datastoreRepository.getEntity).toHaveBeenCalledTimes(1); // get catalog.sku
    });

    it('premium sku returns 403', async () => {
        (body as any).skuCode = 'skuWithMaxQty';
        const req = getMockReq({ method: 'POST', body });

        await createNonEnumeratedItem(req, res);

        expect(res.statusCode).toEqual(StatusCodes.FORBIDDEN);
        expect(res._getJSON().code).toEqual('CREATE_NON_ENUMERATED_ITEM_00002');
        expect(mocks.datastoreRepository.getEntity).toHaveBeenCalledTimes(1); // get catalog.sku
    });

    it('duplicate itemCode retries and returns 200', async () => {
        const auditId: number = Math.floor(Math.random() * 10000000000);
        mocks.datastoreTransaction.commit.mockReturnValueOnce(mockDatastoreCommitResponse('audit', auditId));

        const req = getMockReq({ method: 'POST', body });

        mocks.datastoreRepository.insertEntity
            .mockImplementationOnce(() => { throw { code: ALREADY_EXISTS } });

        await createNonEnumeratedItem(req, res);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(mocks.datastoreRepository.getEntity).toHaveBeenCalledTimes(1); // get catalog.sku
        expect(mocks.datastoreRepository.transaction).toHaveBeenCalledTimes(2); // once for each try
        expect(mocks.datastoreTransaction.run).toHaveBeenCalledTimes(2);
        expect(mocks.datastoreTransaction.rollback).toHaveBeenCalledTimes(1); // rolled back failure
        expect(mocks.datastoreTransaction.commit).toHaveBeenCalledTimes(1); // committed success
        expect(mocks.datastoreRepository.insertEntity).toHaveBeenCalledTimes(3); // item x 2, audit

        const mockPublisher = mocks.eventPublisher.mock.instances[0];
        expect(mockPublisher.publishEvent).toHaveBeenCalledTimes(1); // item event published
    });

    it('duplicate itemCode retries and fails after 3 attempts', async () => {
        const req = getMockReq({ method: 'POST', body });

        const alreadyExistsError: any = new Error('mock alreadyExistsError');
        alreadyExistsError.code = ALREADY_EXISTS;

        mocks.datastoreRepository.insertEntity
            .mockImplementationOnce(() => { throw alreadyExistsError })
            .mockImplementationOnce(() => { throw alreadyExistsError })
            .mockImplementationOnce(() => { throw alreadyExistsError });

        await createNonEnumeratedItem(req, res);

        expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res._getJSON().code).toEqual('CREATE_NON_ENUMERATED_ITEM_00100');
        expect(mocks.datastoreRepository.getEntity).toHaveBeenCalledTimes(1); // get catalog.sku
        expect(mocks.datastoreRepository.transaction).toHaveBeenCalledTimes(3); // once for each try
        expect(mocks.datastoreTransaction.run).toHaveBeenCalledTimes(3);
        expect(mocks.datastoreTransaction.rollback).toHaveBeenCalledTimes(3); // 3 failures rolled back
        expect(mocks.datastoreRepository.insertEntity).toHaveBeenCalledTimes(3); // item x 3, 0 audit

        const mockPublisher = mocks.eventPublisher.mock.instances[0];
        expect(mockPublisher.publishEvent).toHaveBeenCalledTimes(0); // item event published
    });

    it('valid request returns 200', async () => {
        const auditId: number = Math.floor(Math.random() * 10000000000);
        mocks.datastoreTransaction.commit.mockReturnValueOnce(mockDatastoreCommitResponse('audit', auditId));

        const req = getMockReq({ method: 'POST', body });

        await createNonEnumeratedItem(req, res);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(mocks.datastoreRepository.getEntity).toHaveBeenCalledTimes(1); // get catalog.sku
        expect(mocks.datastoreRepository.transaction).toHaveBeenCalledTimes(1);
        expect(mocks.datastoreTransaction.run).toHaveBeenCalledTimes(1);
        expect(mocks.datastoreTransaction.commit).toHaveBeenCalledTimes(1);
        expect(mocks.datastoreRepository.insertEntity).toHaveBeenCalledTimes(2); // item, audit

        const mockPublisher = mocks.eventPublisher.mock.instances[0];
        expect(mockPublisher.publishEvent).toHaveBeenCalledTimes(1); // item event published
        const eventMessage: any = mocked(mockPublisher.publishEvent).mock.calls[0][0];
        expect(eventMessage.eventId).toEqual(`${auditId}`);
        expect(eventMessage.skuCode).toEqual(body.skuCode);
    });

});
