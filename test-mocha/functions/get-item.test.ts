import * as functions from '@google-cloud/functions-framework';
import { HttpFunction, Request } from '@google-cloud/functions-framework';
import { getFunction } from '@google-cloud/functions-framework/testing';
import * as sinon from 'sinon';
import { expect } from 'chai';
import * as MockExpressResponse from 'mock-express-response';
import { GetItem } from "../../src/functions/get-item";
import { loadConfig } from "../../src/config/all-config";
import { functionWrapper } from '../../src/helpers/wrapper';
import { StatusCodes } from 'http-status-codes';

const config = loadConfig({
    EMAIL_HASHING_SECRET: 'shhh this is a secret',
    ASSETS_HOST: 'https://assets.example.com',
    FLEX_HOST: 'https://flex-dev.example.com',
    FLEX_URL: 'https://flex-dev.example.com',
    SKNAPP_HOST: 'https://app-dev.example.com',
    SKNAPP_URL: 'https://app-dev.example.com',
    GCLOUD_PROJECT: 'local',
    GCLOUD_REGION: 'europe-west2',
})

const handler: HttpFunction = async (req, res) => functionWrapper(GetItem.handler, req, res, config);
functions.http('get-item', handler);

describe('function - get-item', () => {

    afterEach(function () {
        sinon.restore();
    });

    it('asserts \'platform\' and \'token\' required', async () => {
        const req = { method: 'GET', path: '' } as Request;
        const res = new MockExpressResponse()

        const instance = getFunction('get-item') as HttpFunction;

        await instance(req, res);

        expect(res.statusCode).equal(StatusCodes.BAD_REQUEST);
        expect(res._getString()).to.contain('platform code and ownership token must be provided in path');
    })

    it('ignores path additional element', async () => {
        const platform = "SKN";
        const token = "338a6b3128";
        const req = {
            method: 'GET',
            path: `/bla/${platform}/${token}`,
        } as Request;
        const res = new MockExpressResponse()

        const instance = getFunction('get-item') as HttpFunction;

        const byThumbprint = sinon.fake.resolves();

        const fakeByThumbprint = sinon.replace(GetItem.repository, "byThumbprint", byThumbprint);

        await instance(req, res);

        sinon.assert.calledOnceWithExactly(fakeByThumbprint, platform, token)
    })

    it('returns item', async () => {
        const platform = "SKN";
        const token = "338a6b3128";
        const req = {
            method: 'GET',
            path: `${platform}/${token}`,
        } as Request;
        const res = new MockExpressResponse()

        const instance = getFunction('get-item') as HttpFunction;


        const byThumbprint = sinon.fake.resolves(
            {
                "thumbprint": token,
                "brandCode": "TEST",
                "claimCode": "test123",
                "card": '{"back": {"token": {"color": "#FFFFFFFF","font-size": "25pt","font-family": "ShareTechMono-Regular","font-weight": "Regular","x": 470,"y": 340}}}',
                "description": "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
                "flexHost": "https://flex-dev.example.com",
                "maxQty": 10000,
                "saleQty": 14,
                "sknappHost": "https://app-dev.example.com",
                "stockKeepingUnitCode": "TEST-OCTAHEDRON-COMMON",
                "stockKeepingUnitName": "Common Octahedron",
                "stockKeepingUnitRarity": 1,
                "version": "1",
                "created": 1657622239335000,
                "skn": "STATIC",
                "platformCode": platform,
                "certVersion": "v1",
                "state": "UNBOXED",
                "source": "SALE",
                "nftState": "UNMINTED",
                "tier": "PREMIUM",
                "recommendedRetailPrice": 100
            },
        );

        const fakeByThumbprint = sinon.replace(GetItem.repository, "byThumbprint", byThumbprint);

        await instance(req, res);

        expect(res.statusCode).equal(StatusCodes.OK);

        sinon.assert.calledOnceWithExactly(fakeByThumbprint, platform, token)

        expect(res._getJSON()).to.eql(
            {
                "token": "338a6b3128",
                "thumbprint": "338a6b3128",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "issue": 14,
                "saleQty": 14,
                "maximum": 10000,
                "maxQty": 10000,
                "giveaway": "test123",
                "cardJson": "{\"back\": {\"token\": {\"color\": \"#FFFFFFFF\",\"font-size\": \"25pt\",\"font-family\": \"ShareTechMono-Regular\",\"font-weight\": \"Regular\",\"x\": 470,\"y\": 340}}}",
                "description": "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
                "brand": "TEST",
                "brandCode": "TEST",
                "sku": "TEST-OCTAHEDRON-COMMON",
                "stockKeepingUnitCode": "TEST-OCTAHEDRON-COMMON",
                "name": "Common Octahedron",
                "rarity": 1,
                "version": "1",
                "claimCode": "test123",
                "created": "2022-07-12T10:37:19.335Z",
                "platform": "SKN",
                "platformCode": "SKN",
                "certVersion": "v1",
                "nftState": "UNMINTED",
                "recommendedRetailPrice": 100,
                "rrp": 100,
                "source": "SALE",
                "tier": "PREMIUM",
                "media": {
                    "info": {
                        "image": "https://flex-dev.example.com/skn/v1/back/default/338a6b3128.jpg"
                    },
                    "model": {
                        "config": "https://assets.example.com/sku.v1.3DConfig.TEST-OCTAHEDRON-COMMON.json",
                        "glb": "https://assets.example.com/sku.v1.3DView.TEST-OCTAHEDRON-COMMON.glb"
                    },
                    "skn": {
                        "image": "https://flex-dev.example.com/skn/v1/card/default/338a6b3128.jpg"
                    },
                    "snapchat": {
                        "image": "https://flex-dev.example.com/skn/v1/card/snapchat/338a6b3128.png"
                    },
                    "social": {
                        "image": "https://flex-dev.example.com/skn/v1/card/og/338a6b3128.png"
                    }
                }
            }
        );
    })

    it('supports item with null card', async () => {
        const platform = "SKN";
        const token = "338a6b3128";
        const req = {
            method: 'GET',
            path: `${platform}/${token}`,
        } as Request;
        const res = new MockExpressResponse()

        const instance = getFunction('get-item') as HttpFunction;


        const byThumbprint = sinon.fake.resolves(
            {
                "thumbprint": token,
                "brandCode": "TEST",
                "claimCode": "test123",
                "card": null,
                "description": "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
                "flexHost": "https://flex-dev.example.com",
                "maxQty": 10000,
                "saleQty": 14,
                "sknappHost": "https://app-dev.example.com",
                "stockKeepingUnitCode": "TEST-OCTAHEDRON-COMMON",
                "stockKeepingUnitName": "Common Octahedron",
                "stockKeepingUnitRarity": 1,
                "version": "1",
                "created": 1657622239335000,
                "skn": "VIDEO",
                "platformCode": platform,
                "certVersion": "v1",
                "state": "UNBOXED",
                "source": "SALE",
                "nftState": "UNMINTED",
                "tier": "PREMIUM",
                "recommendedRetailPrice": 200
            },
        );

        const fakeByThumbprint = sinon.replace(GetItem.repository, "byThumbprint", byThumbprint);

        await instance(req, res);

        sinon.assert.calledOnceWithExactly(fakeByThumbprint, platform, token)

        expect(res._getJSON()).to.eql(
            {
                "token": "338a6b3128",
                "thumbprint": "338a6b3128",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "issue": 14,
                "saleQty": 14,
                "maximum": 10000,
                "maxQty": 10000,
                "giveaway": "test123",
                "cardJson": null,
                "description": "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
                "brand": "TEST",
                "brandCode": "TEST",
                "sku": "TEST-OCTAHEDRON-COMMON",
                "stockKeepingUnitCode": "TEST-OCTAHEDRON-COMMON",
                "name": "Common Octahedron",
                "rarity": 1,
                "version": "1",
                "claimCode": "test123",
                "created": "2022-07-12T10:37:19.335Z",
                "platform": "SKN",
                "platformCode": "SKN",
                "certVersion": "v1",
                "nftState": "UNMINTED",
                "recommendedRetailPrice": 200,
                "rrp": 200,
                "source": "SALE",
                "tier": "PREMIUM",
                "media": {
                    "info": {
                        "image": "https://flex-dev.example.com/skn/v1/back/default/338a6b3128.jpg"
                    },
                    "model": {
                        "config": "https://assets.example.com/sku.v1.3DConfig.TEST-OCTAHEDRON-COMMON.json",
                        "glb": "https://assets.example.com/sku.v1.3DView.TEST-OCTAHEDRON-COMMON.glb"
                    },
                    "skn": {
                        "image": "https://assets.example.com/sku.TEST-OCTAHEDRON-COMMON.skn.jpg",
                        "video": "https://assets.example.com/sku.TEST-OCTAHEDRON-COMMON.skn.mp4"
                    },
                    "snapchat": {
                        "image": "https://flex-dev.example.com/skn/v1/card/snapchat/338a6b3128.png"
                    },
                    "social": {
                        "image": "https://flex-dev.example.com/skn/v1/card/og/338a6b3128.png"
                    }
                }
            }
        );
    })

    it('returns 404 if item not found', async () => {
        const platform = "SKN";
        const token = "338a6b3128";
        const req = {
            method: 'GET',
            path: `${platform}/${token}`,
        } as Request;
        const res = new MockExpressResponse()

        const instance = getFunction('get-item') as HttpFunction;


        const byThumbprint = sinon.fake.resolves(null);

        const fakeByThumbprint = sinon.replace(GetItem.repository, "byThumbprint", byThumbprint);

        await instance(req, res);

        sinon.assert.calledOnceWithExactly(fakeByThumbprint, platform, token)

        expect(res.statusCode).equal(StatusCodes.NOT_FOUND);
        expect(res._getString()).to.eql('Not Found');

    })
})
