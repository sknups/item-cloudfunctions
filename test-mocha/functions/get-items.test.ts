import * as functions from '@google-cloud/functions-framework';
import { HttpFunction, Request } from '@google-cloud/functions-framework';
import { getFunction } from '@google-cloud/functions-framework/testing';
import * as sinon from 'sinon';
import { expect } from 'chai';
import * as MockExpressResponse from 'mock-express-response';
import { GetItems } from "../../src/functions/get-items";
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

const handler: HttpFunction = async (req, res) => functionWrapper(GetItems.handler, req, res, config);
functions.http('get-items', handler);

describe('function - get-items', () => {

    afterEach(function () {
        sinon.restore();
    });

    it('asserts \'platformCode\' required', async () => {
        const req = { method: 'POST', body: {} } as Request;
        const res = new MockExpressResponse()

        const instance = getFunction('get-items') as HttpFunction;

        await instance(req, res);

        expect(res.statusCode).equal(StatusCodes.BAD_REQUEST);
        expect(res._getString()).to.contain('platformCode should not be empty');
    })

    it('asserts \'emailAddress\', \'blockchainAddress\' or \'user\' required ', async () => {
        const req = {
            method: 'POST', body: {
                platformCode: 'TEST',
            }
        } as Request;
        const res = new MockExpressResponse()

        const instance = getFunction('get-items') as HttpFunction;

        await instance(req, res);

        expect(res.statusCode).equal(StatusCodes.BAD_REQUEST);
        expect(res._getString()).to.contain('\'emailAddress\' missing. must supply at least emailAddress, user or blockchainAddress');
        expect(res._getString()).to.contain('\'user\' missing. must supply at least emailAddress, user or blockchainAddress');
        expect(res._getString()).to.contain('\'blockchainAddress\' missing. must supply at least emailAddress, user or blockchainAddress');
    })

    it('gets items from \'emailAddress\'', async () => {
        const req = {
            method: 'POST', body: {
                platformCode: 'TEST',
                emailAddress: 'user@example.com'
            }
        } as Request;
        const res = new MockExpressResponse()

        const instance = getFunction('get-items') as HttpFunction;

        const byEmailHash = sinon.fake.resolves([
            {
                "thumbprint": "338a6b3128",
                "state": "UNBOXED",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "certVersion": "v1",
                "saleQty": 14,
                "maxQty": 10000,
                "source": "SALE",
                "nftState": "UNMINTED",
                "claimCode": null,
                "description": "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
                "brandCode": "TEST",
                "platformCode": "SKN",
                "stockKeepingUnitCode": "TEST-OCTAHEDRON-COMMON",
                "stockKeepingUnitName": "Common Octahedron",
                "tier": "GIVEAWAY",
                "recommendedRetailPrice": 100,
                "created": 1657622239335000,
                "stockKeepingUnitRarity": 1,
                "card": null,
                "version": "1",
                "skn": "STATIC"
            },
            {
                "thumbprint": "07e6554733",
                "state": "UNBOXED",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "certVersion": "v1",
                "saleQty": 8,
                "maxQty": 100,
                "source": "GIVEAWAY",
                "nftState": "UNMINTED",
                "claimCode": "claim-123",
                "description": "The only regular solid which tessellates Euclidean space: the hexahedron.  The ancients believed this caused the solidity of the Earth.",
                "brandCode": "TEST",
                "platformCode": "SKN",
                "stockKeepingUnitCode": "TEST-CUBE-RARE",
                "stockKeepingUnitName": "Rare Cube",
                "tier": "GREEN",
                "recommendedRetailPrice": 1000,
                "created": 1654013672253000,
                "stockKeepingUnitRarity": 1,
                "card": null,
                "version": "1",
                "skn": "VIDEO"
            },
        ]);
        const byWalletAddress = sinon.fake.resolves([]);

        const fakeByEmailHash = sinon.replace(GetItems.repository, "byEmailHash", byEmailHash);
        const fakeByWalletAddress = sinon.replace(GetItems.repository, "byWalletAddress", byWalletAddress);

        await instance(req, res);

        const platform = 'TEST';
        const emailHash = '495a8c7b1ab6fd611377ba81fe75cdead63f0ebe88a9260806a3fba790400805';
        sinon.assert.calledOnceWithExactly(fakeByEmailHash, platform, emailHash)

        sinon.assert.notCalled(fakeByWalletAddress);

        expect(res._getJSON()).to.eql([
            {
                "thumbprint": "338a6b3128",
                "token": "338a6b3128",
                "cardJson": null,
                "version": "1",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "certVersion": "v1",
                "saleQty": 14,
                "issue": 14,
                "maxQty": 10000,
                "maximum": 10000,
                "source": "SALE",
                "nftState": "UNMINTED",
                "platform": "SKN",
                "platformCode": "SKN",
                "claimCode": null,
                "giveaway": null,
                "name": "Common Octahedron",
                "description": "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
                "brandCode": "TEST",
                "brand": "TEST",
                "stockKeepingUnitCode": "TEST-OCTAHEDRON-COMMON",
                "sku": "TEST-OCTAHEDRON-COMMON",
                "tier": "GIVEAWAY",
                "recommendedRetailPrice": 100,
                "rrp": 100,
                "created": "2022-07-12T10:37:19.335Z",
                "rarity": 1,
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
            },
            {
                "thumbprint": "07e6554733",
                "token": "07e6554733",
                "cardJson": null,
                "version": "1",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "certVersion": "v1",
                "saleQty": 8,
                "issue": 8,
                "maxQty": 100,
                "maximum": 100,
                "source": "GIVEAWAY",
                "nftState": "UNMINTED",
                "platform": "SKN",
                "platformCode": "SKN",
                "claimCode": "claim-123",
                "giveaway": "claim-123",
                "name": "Rare Cube",
                "description": "The only regular solid which tessellates Euclidean space: the hexahedron.  The ancients believed this caused the solidity of the Earth.",
                "brandCode": "TEST",
                "brand": "TEST",
                "stockKeepingUnitCode": "TEST-CUBE-RARE",
                "sku": "TEST-CUBE-RARE",
                "tier": "GREEN",
                "recommendedRetailPrice": 1000,
                "rrp": 1000,
                "created": "2022-05-31T16:14:32.253Z",
                "rarity": 1,
                "media": {
                    "info": {
                        "image": "https://flex-dev.example.com/skn/v1/back/default/07e6554733.jpg"
                    },
                    "model": {
                        "config": "https://assets.example.com/sku.v1.3DConfig.TEST-CUBE-RARE.json",
                        "glb": "https://assets.example.com/sku.v1.3DView.TEST-CUBE-RARE.glb"
                    },
                    "skn": {
                        "image": "https://assets.example.com/sku.TEST-CUBE-RARE.skn.jpg",
                        "video": "https://assets.example.com/sku.TEST-CUBE-RARE.skn.mp4"
                    },
                    "snapchat": {
                        "image": "https://flex-dev.example.com/skn/v1/card/snapchat/07e6554733.png"
                    },
                    "social": {
                        "image": "https://flex-dev.example.com/skn/v1/card/og/07e6554733.png"
                    }
                }
            },
        ]);
    })

    it('gets items from \'blockchainAddress\' ', async () => {
        const req = {
            method: 'POST', body: {
                platformCode: 'TEST',
                blockchainAddress: 'SOL.devnet.5KNMRFwPbPhhAnxJJby5PDo454rrKDuoHuJf9cNa7XUW'
            }
        } as Request;
        const res = new MockExpressResponse()

        const instance = getFunction('get-items') as HttpFunction;

        const byWalletAddress = sinon.fake.resolves([
            {
                "thumbprint": "259bb1e563",
                "state": "UNBOXED",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "certVersion": "v1",
                "saleQty": 1,
                "maxQty": 10000,
                "source": "GIVEAWAY",
                "nftState": "MINTED",
                "claimCode": "tetrahedron-v2",
                "stockKeepingUnitName": "Common Tetrahedron",
                "description": "The fire element. Simplest of all polyhedra, strongest of all pyramids, the tetrahedron has only four prickly vertices.",
                "brandCode": "TEST",
                "platformCode": "SKN",
                "stockKeepingUnitCode": "TEST-TETRAHEDRON-COMMON-V2",
                "recommendedRetailPrice": 0,
                "created": 1657622239335000,
                "stockKeepingUnitRarity": 1,
                "card": null,
                "version": "1",
                "skn": "STATIC",
            },
            {
                "thumbprint": "675e2c7898",
                "state": "UNBOXED",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "certVersion": "v1",
                "saleQty": 1,
                "maxQty": 10000,
                "source": "GIVEAWAY",
                "nftState": "MINTED",
                "claimCode": "tetrahedron-v3",
                "stockKeepingUnitName": "Common Tetrahedron",
                "description": "The fire element. Simplest of all polyhedra, strongest of all pyramids, the tetrahedron has only four prickly vertices.",
                "brandCode": "TEST",
                "platformCode": "SKN",
                "stockKeepingUnitCode": "TEST-TETRAHEDRON-COMMON-V3",
                "recommendedRetailPrice": 0,
                "created": 1654013672253000,
                "stockKeepingUnitRarity": 1,
                "card": null,
                "version": "1",
                "skn": "STATIC",
            }
        ]);

        const fakeByWalletAddress = sinon.replace(GetItems.repository, "byWalletAddress", byWalletAddress);

        await instance(req, res);

        const platform = 'TEST';

        const walletAddress = 'SOL.devnet.5KNMRFwPbPhhAnxJJby5PDo454rrKDuoHuJf9cNa7XUW';
        sinon.assert.calledOnceWithExactly(fakeByWalletAddress, platform, walletAddress)

        expect(res._getJSON()).to.eql([
            {
                "thumbprint": "259bb1e563",
                "token": "259bb1e563",
                "cardJson": null,
                "version": "1",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "certVersion": "v1",
                "saleQty": 1,
                "issue": 1,
                "maxQty": 10000,
                "maximum": 10000,
                "source": "GIVEAWAY",
                "nftState": "MINTED",
                "platform": "SKN",
                "platformCode": "SKN",
                "claimCode": "tetrahedron-v2",
                "giveaway": "tetrahedron-v2",
                "name": "Common Tetrahedron",
                "description": "The fire element. Simplest of all polyhedra, strongest of all pyramids, the tetrahedron has only four prickly vertices.",
                "brandCode": "TEST",
                "brand": "TEST",
                "stockKeepingUnitCode": "TEST-TETRAHEDRON-COMMON-V2",
                "sku": "TEST-TETRAHEDRON-COMMON-V2",
                "recommendedRetailPrice": 0,
                "rrp": 0,
                "created": "2022-07-12T10:37:19.335Z",
                "rarity": 1,
                "media": {
                    "info": {
                        "image": "https://flex-dev.example.com/skn/v1/back/default/259bb1e563.jpg"
                    },
                    "model": {
                        "config": "https://assets.example.com/sku.v1.3DConfig.TEST-TETRAHEDRON-COMMON-V2.json",
                        "glb": "https://assets.example.com/sku.v1.3DView.TEST-TETRAHEDRON-COMMON-V2.glb"
                    },
                    "skn": {
                        "image": "https://flex-dev.example.com/skn/v1/card/default/259bb1e563.jpg"
                    },
                    "snapchat": {
                        "image": "https://flex-dev.example.com/skn/v1/card/snapchat/259bb1e563.png"
                    },
                    "social": {
                        "image": "https://flex-dev.example.com/skn/v1/card/og/259bb1e563.png"
                    }
                }
            },
            {
                "thumbprint": "675e2c7898",
                "token": "675e2c7898",
                "cardJson": null,
                "version": "1",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "certVersion": "v1",
                "saleQty": 1,
                "issue": 1,
                "maxQty": 10000,
                "maximum": 10000,
                "source": "GIVEAWAY",
                "nftState": "MINTED",
                "platform": "SKN",
                "platformCode": "SKN",
                "claimCode": "tetrahedron-v3",
                "giveaway": "tetrahedron-v3",
                "name": "Common Tetrahedron",
                "description": "The fire element. Simplest of all polyhedra, strongest of all pyramids, the tetrahedron has only four prickly vertices.",
                "brandCode": "TEST",
                "brand": "TEST",
                "stockKeepingUnitCode": "TEST-TETRAHEDRON-COMMON-V3",
                "sku": "TEST-TETRAHEDRON-COMMON-V3",
                "recommendedRetailPrice": 0,
                "rrp": 0,
                "created": "2022-05-31T16:14:32.253Z",
                "rarity": 1,
                "media": {
                    "info": {
                        "image": "https://flex-dev.example.com/skn/v1/back/default/675e2c7898.jpg"
                    },
                    "model": {
                        "config": "https://assets.example.com/sku.v1.3DConfig.TEST-TETRAHEDRON-COMMON-V3.json",
                        "glb": "https://assets.example.com/sku.v1.3DView.TEST-TETRAHEDRON-COMMON-V3.glb"
                    },
                    "skn": {
                        "image": "https://flex-dev.example.com/skn/v1/card/default/675e2c7898.jpg"
                    },
                    "snapchat": {
                        "image": "https://flex-dev.example.com/skn/v1/card/snapchat/675e2c7898.png"
                    },
                    "social": {
                        "image": "https://flex-dev.example.com/skn/v1/card/og/675e2c7898.png"
                    }
                }
            }
        ]);
    })


    it('gets items from \'user\' ', async () => {
        const platform = 'TEST';
        const user = 'abc123456';

        const req = {
            method: 'POST', body: {
                platformCode: platform,
                user: user
            }
        } as Request;
        const res = new MockExpressResponse()

        const instance = getFunction('get-items') as HttpFunction;

        const byUser = sinon.fake.resolves([
            {
                "thumbprint": "259bb1e986",
                "state": "UNBOXED",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "certVersion": "v1",
                "saleQty": 1,
                "maxQty": 10000,
                "source": "GIVEAWAY",
                "nftState": "MINTED",
                "claimCode": "tetrahedron-v2",
                "stockKeepingUnitName": "Common Tetrahedron",
                "description": "The fire element. Simplest of all polyhedra, strongest of all pyramids, the tetrahedron has only four prickly vertices.",
                "brandCode": "TEST",
                "platformCode": "SKN",
                "stockKeepingUnitCode": "TEST-TETRAHEDRON-COMMON-V2",
                "recommendedRetailPrice": 0,
                "created": 1657622239335000,
                "stockKeepingUnitRarity": 1,
                "card": null,
                "version": "1",
                "skn": "STATIC"
            },
            {
                "thumbprint": "675e2c0054",
                "state": "UNBOXED",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "certVersion": "v1",
                "saleQty": 1,
                "maxQty": 10000,
                "source": "GIVEAWAY",
                "nftState": "MINTED",
                "claimCode": "tetrahedron-v3",
                "stockKeepingUnitName": "Common Tetrahedron",
                "description": "The fire element. Simplest of all polyhedra, strongest of all pyramids, the tetrahedron has only four prickly vertices.",
                "brandCode": "TEST",
                "platformCode": "SKN",
                "stockKeepingUnitCode": "TEST-TETRAHEDRON-COMMON-V3",
                "recommendedRetailPrice": 0,
                "created": 1654013672253000,
                "stockKeepingUnitRarity": 1,
                "card": null,
                "version": "1",
                "skn": "STATIC"
            }
        ]);

        const fakeByUser = sinon.replace(GetItems.repository, "byUser", byUser);

        await instance(req, res);

        sinon.assert.calledOnceWithExactly(fakeByUser, platform, user)

        expect(res._getJSON()).to.eql([
            {
                "thumbprint": "259bb1e986",
                "token": "259bb1e986",
                "cardJson": null,
                "version": "1",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "certVersion": "v1",
                "saleQty": 1,
                "issue": 1,
                "maxQty": 10000,
                "maximum": 10000,
                "source": "GIVEAWAY",
                "nftState": "MINTED",
                "platform": "SKN",
                "platformCode": "SKN",
                "claimCode": "tetrahedron-v2",
                "giveaway": "tetrahedron-v2",
                "name": "Common Tetrahedron",
                "description": "The fire element. Simplest of all polyhedra, strongest of all pyramids, the tetrahedron has only four prickly vertices.",
                "brandCode": "TEST",
                "brand": "TEST",
                "stockKeepingUnitCode": "TEST-TETRAHEDRON-COMMON-V2",
                "sku": "TEST-TETRAHEDRON-COMMON-V2",
                "recommendedRetailPrice": 0,
                "rrp": 0,
                "created": "2022-07-12T10:37:19.335Z",
                "rarity": 1,
                "media": {
                    "info": {
                        "image": "https://flex-dev.example.com/skn/v1/back/default/259bb1e986.jpg"
                    },
                    "model": {
                        "config": "https://assets.example.com/sku.v1.3DConfig.TEST-TETRAHEDRON-COMMON-V2.json",
                        "glb": "https://assets.example.com/sku.v1.3DView.TEST-TETRAHEDRON-COMMON-V2.glb"
                    },
                    "skn": {
                        "image": "https://flex-dev.example.com/skn/v1/card/default/259bb1e986.jpg"
                    },
                    "snapchat": {
                        "image": "https://flex-dev.example.com/skn/v1/card/snapchat/259bb1e986.png"
                    },
                    "social": {
                        "image": "https://flex-dev.example.com/skn/v1/card/og/259bb1e986.png"
                    }
                }
            },
            {
                "thumbprint": "675e2c0054",
                "token": "675e2c0054",
                "cardJson": null,
                "version": "1",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "certVersion": "v1",
                "saleQty": 1,
                "issue": 1,
                "maxQty": 10000,
                "maximum": 10000,
                "source": "GIVEAWAY",
                "nftState": "MINTED",
                "platform": "SKN",
                "platformCode": "SKN",
                "claimCode": "tetrahedron-v3",
                "giveaway": "tetrahedron-v3",
                "name": "Common Tetrahedron",
                "description": "The fire element. Simplest of all polyhedra, strongest of all pyramids, the tetrahedron has only four prickly vertices.",
                "brandCode": "TEST",
                "brand": "TEST",
                "stockKeepingUnitCode": "TEST-TETRAHEDRON-COMMON-V3",
                "sku": "TEST-TETRAHEDRON-COMMON-V3",
                "recommendedRetailPrice": 0,
                "rrp": 0,
                "created": "2022-05-31T16:14:32.253Z",
                "rarity": 1,
                "media": {
                    "info": {
                        "image": "https://flex-dev.example.com/skn/v1/back/default/675e2c0054.jpg"
                    },
                    "model": {
                        "config": "https://assets.example.com/sku.v1.3DConfig.TEST-TETRAHEDRON-COMMON-V3.json",
                        "glb": "https://assets.example.com/sku.v1.3DView.TEST-TETRAHEDRON-COMMON-V3.glb"
                    },
                    "skn": {
                        "image": "https://flex-dev.example.com/skn/v1/card/default/675e2c0054.jpg"
                    },
                    "snapchat": {
                        "image": "https://flex-dev.example.com/skn/v1/card/snapchat/675e2c0054.png"
                    },
                    "social": {
                        "image": "https://flex-dev.example.com/skn/v1/card/og/675e2c0054.png"
                    }
                }
            }
        ]);
    })

    it('gets items from \'emailAddress\', \'user\' and  \'blockchainAddress\' ', async () => {
        const platform = 'TEST';
        const emailAddress = 'user@example.com';
        const user = 'abc123456';
        const blockchainAddress = 'SOL.devnet.5KNMRFwPbPhhAnxJJby5PDo454rrKDuoHuJf9cNa7XUW';

        const req = {
            method: 'POST', body: {
                platformCode: platform,
                emailAddress,
                user,
                blockchainAddress,
            }
        } as Request;
        const res = new MockExpressResponse()

        const instance = getFunction('get-items') as HttpFunction;

        const byEmailHash = sinon.fake.resolves([
            {
                "thumbprint": "338a6b3128",
                "state": "UNBOXED",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "certVersion": "v1",
                "saleQty": 14,
                "maxQty": 10000,
                "source": "SALE",
                "nftState": "UNMINTED",
                "claimCode": null,
                "stockKeepingUnitName": "Common Octahedron",
                "description": "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
                "brandCode": "TEST",
                "platformCode": "SKN",
                "stockKeepingUnitCode": "TEST-OCTAHEDRON-COMMON",
                "tier": "GIVEAWAY",
                "recommendedRetailPrice": 100,
                "created": 1657622239335000,
                "stockKeepingUnitRarity": 1,
                "card": null,
                "version": "1",
                "skn": "STATIC"
            },
            {
                "thumbprint": "07e6554733",
                "state": "UNBOXED",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "certVersion": "v1",
                "saleQty": 8,
                "maxQty": 100,
                "source": "GIVEAWAY",
                "nftState": "UNMINTED",
                "claimCode": "claim-123",
                "stockKeepingUnitName": "Rare Cube",
                "description": "The only regular solid which tessellates Euclidean space: the hexahedron.  The ancients believed this caused the solidity of the Earth.",
                "brandCode": "TEST",
                "platformCode": "SKN",
                "stockKeepingUnitCode": "TEST-CUBE-RARE",
                "tier": "GREEN",
                "recommendedRetailPrice": 1000,
                "created": 1654013672253000,
                "stockKeepingUnitRarity": 1,
                "card": null,
                "version": "1",
                "skn": "STATIC"
            },
        ]);

        const byUser = sinon.fake.resolves([
            {
                "thumbprint": "338a6b3128", //Duplicate Item
                "state": "UNBOXED",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "certVersion": "v1",
                "saleQty": 14,
                "maxQty": 10000,
                "source": "SALE",
                "nftState": "UNMINTED",
                "claimCode": null,
                "stockKeepingUnitName": "Common Tetrahedron",
                "description": "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
                "brandCode": "TEST",
                "platformCode": "SKN",
                "stockKeepingUnitCode": "TEST-OCTAHEDRON-COMMON",
                "tier": "GIVEAWAY",
                "recommendedRetailPrice": 100,
                "created": 1657622239335000,
                "stockKeepingUnitRarity": 1,
                "card": null,
                "version": "1",
                "skn": "STATIC"
            },
            {
                "thumbprint": "07e6554744",
                "state": "UNBOXED",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "certVersion": "v1",
                "saleQty": 8,
                "maxQty": 100,
                "source": "GIVEAWAY",
                "nftState": "UNMINTED",
                "claimCode": "claim-123",
                "stockKeepingUnitName": "Rare Cube",
                "description": "The only regular solid which tessellates Euclidean space: the hexahedron.  The ancients believed this caused the solidity of the Earth.",
                "brandCode": "TEST",
                "platformCode": "SKN",
                "stockKeepingUnitCode": "TEST-CUBE-RARE",
                "tier": "GREEN",
                "recommendedRetailPrice": 1000,
                "created": 1654013672253000,
                "stockKeepingUnitRarity": 1,
                "card": null,
                "version": "1",
                "skn": "STATIC"
            },
        ]);

        const byWalletAddress = sinon.fake.resolves([
            {
                "thumbprint": "259bb1e563",
                "state": "UNBOXED",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "certVersion": "v1",
                "saleQty": 1,
                "maxQty": 10000,
                "source": "GIVEAWAY",
                "nftState": "MINTED",
                "claimCode": "tetrahedron-v2",
                "stockKeepingUnitName": "Common Tetrahedron",
                "description": "The fire element. Simplest of all polyhedra, strongest of all pyramids, the tetrahedron has only four prickly vertices.",
                "brandCode": "TEST",
                "platformCode": "SKN",
                "stockKeepingUnitCode": "TEST-TETRAHEDRON-COMMON-V2",
                "tier": "GIVEAWAY",
                "recommendedRetailPrice": 0,
                "created": 1657622239335000,
                "stockKeepingUnitRarity": 1,
                "card": null,
                "version": "1",
                "skn": "STATIC"
            },
            {
                "thumbprint": "675e2c7898",
                "state": "UNBOXED",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "certVersion": "v1",
                "saleQty": 1,
                "maxQty": 10000,
                "source": "GIVEAWAY",
                "nftState": "MINTED",
                "claimCode": "tetrahedron-v3",
                "stockKeepingUnitName": "Common Tetrahedron",
                "description": "The fire element. Simplest of all polyhedra, strongest of all pyramids, the tetrahedron has only four prickly vertices.",
                "brandCode": "TEST",
                "platformCode": "SKN",
                "stockKeepingUnitCode": "TEST-TETRAHEDRON-COMMON-V3",
                "tier": "GIVEAWAY",
                "recommendedRetailPrice": 0,
                "created": 1654013672253000,
                "stockKeepingUnitRarity": 1,
                "card": null,
                "version": "1",
                "skn": "STATIC"
            }
        ]);

        const fakeByEmailHash = sinon.replace(GetItems.repository, "byEmailHash", byEmailHash);
        const fakeByUser = sinon.replace(GetItems.repository, "byUser", byUser);
        const fakeByWalletAddress = sinon.replace(GetItems.repository, "byWalletAddress", byWalletAddress);

        await instance(req, res);


        const emailHash = '495a8c7b1ab6fd611377ba81fe75cdead63f0ebe88a9260806a3fba790400805';
        sinon.assert.calledOnceWithExactly(fakeByEmailHash, platform, emailHash)

        sinon.assert.calledOnceWithExactly(fakeByUser, platform, user)

        sinon.assert.calledOnceWithExactly(fakeByWalletAddress, platform, blockchainAddress)

        expect(res._getJSON()).to.eql([
            {
                "thumbprint": "338a6b3128",
                "token": "338a6b3128",
                "cardJson": null,
                "version": "1",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "certVersion": "v1",
                "saleQty": 14,
                "issue": 14,
                "maxQty": 10000,
                "maximum": 10000,
                "source": "SALE",
                "nftState": "UNMINTED",
                "platform": "SKN",
                "platformCode": "SKN",
                "claimCode": null,
                "giveaway": null,
                "name": "Common Octahedron",
                "description": "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
                "brandCode": "TEST",
                "brand": "TEST",
                "stockKeepingUnitCode": "TEST-OCTAHEDRON-COMMON",
                "sku": "TEST-OCTAHEDRON-COMMON",
                "tier": "GIVEAWAY",
                "recommendedRetailPrice": 100,
                "rrp": 100,
                "created": "2022-07-12T10:37:19.335Z",
                "rarity": 1,
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
            },
            {
                "thumbprint": "07e6554733",
                "token": "07e6554733",
                "cardJson": null,
                "version": "1",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "certVersion": "v1",
                "saleQty": 8,
                "issue": 8,
                "maxQty": 100,
                "maximum": 100,
                "source": "GIVEAWAY",
                "nftState": "UNMINTED",
                "platform": "SKN",
                "platformCode": "SKN",
                "claimCode": "claim-123",
                "giveaway": "claim-123",
                "name": "Rare Cube",
                "description": "The only regular solid which tessellates Euclidean space: the hexahedron.  The ancients believed this caused the solidity of the Earth.",
                "brandCode": "TEST",
                "brand": "TEST",
                "stockKeepingUnitCode": "TEST-CUBE-RARE",
                "sku": "TEST-CUBE-RARE",
                "tier": "GREEN",
                "recommendedRetailPrice": 1000,
                "rrp": 1000,
                "created": "2022-05-31T16:14:32.253Z",
                "rarity": 1,
                "media": {
                    "info": {
                        "image": "https://flex-dev.example.com/skn/v1/back/default/07e6554733.jpg"
                    },
                    "model": {
                        "config": "https://assets.example.com/sku.v1.3DConfig.TEST-CUBE-RARE.json",
                        "glb": "https://assets.example.com/sku.v1.3DView.TEST-CUBE-RARE.glb"
                    },
                    "skn": {
                        "image": "https://flex-dev.example.com/skn/v1/card/default/07e6554733.jpg"
                    },
                    "snapchat": {
                        "image": "https://flex-dev.example.com/skn/v1/card/snapchat/07e6554733.png"
                    },
                    "social": {
                        "image": "https://flex-dev.example.com/skn/v1/card/og/07e6554733.png"
                    }
                }
            },
            {
                "thumbprint": "07e6554744",
                "token": "07e6554744",
                "cardJson": null,
                "version": "1",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "certVersion": "v1",
                "saleQty": 8,
                "issue": 8,
                "maxQty": 100,
                "maximum": 100,
                "source": "GIVEAWAY",
                "nftState": "UNMINTED",
                "platform": "SKN",
                "platformCode": "SKN",
                "claimCode": "claim-123",
                "giveaway": "claim-123",
                "name": "Rare Cube",
                "description": "The only regular solid which tessellates Euclidean space: the hexahedron.  The ancients believed this caused the solidity of the Earth.",
                "brandCode": "TEST",
                "brand": "TEST",
                "stockKeepingUnitCode": "TEST-CUBE-RARE",
                "sku": "TEST-CUBE-RARE",
                "tier": "GREEN",
                "recommendedRetailPrice": 1000,
                "rrp": 1000,
                "created": "2022-05-31T16:14:32.253Z",
                "rarity": 1,
                "media": {
                    "info": {
                        "image": "https://flex-dev.example.com/skn/v1/back/default/07e6554744.jpg"
                    },
                    "model": {
                        "config": "https://assets.example.com/sku.v1.3DConfig.TEST-CUBE-RARE.json",
                        "glb": "https://assets.example.com/sku.v1.3DView.TEST-CUBE-RARE.glb"
                    },
                    "skn": {
                        "image": "https://flex-dev.example.com/skn/v1/card/default/07e6554744.jpg"
                    },
                    "snapchat": {
                        "image": "https://flex-dev.example.com/skn/v1/card/snapchat/07e6554744.png"
                    },
                    "social": {
                        "image": "https://flex-dev.example.com/skn/v1/card/og/07e6554744.png"
                    },
                }
            },
            {
                "thumbprint": "259bb1e563",
                "token": "259bb1e563",
                "cardJson": null,
                "version": "1",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "certVersion": "v1",
                "saleQty": 1,
                "issue": 1,
                "maxQty": 10000,
                "maximum": 10000,
                "source": "GIVEAWAY",
                "nftState": "MINTED",
                "platform": "SKN",
                "platformCode": "SKN",
                "claimCode": "tetrahedron-v2",
                "giveaway": "tetrahedron-v2",
                "name": "Common Tetrahedron",
                "description": "The fire element. Simplest of all polyhedra, strongest of all pyramids, the tetrahedron has only four prickly vertices.",
                "brandCode": "TEST",
                "brand": "TEST",
                "stockKeepingUnitCode": "TEST-TETRAHEDRON-COMMON-V2",
                "sku": "TEST-TETRAHEDRON-COMMON-V2",
                "tier": "GIVEAWAY",
                "recommendedRetailPrice": 0,
                "rrp": 0,
                "created": "2022-07-12T10:37:19.335Z",
                "rarity": 1,
                "media": {
                    "info": {
                        "image": "https://flex-dev.example.com/skn/v1/back/default/259bb1e563.jpg"
                    },
                    "model": {
                        "config": "https://assets.example.com/sku.v1.3DConfig.TEST-TETRAHEDRON-COMMON-V2.json",
                        "glb": "https://assets.example.com/sku.v1.3DView.TEST-TETRAHEDRON-COMMON-V2.glb"
                    },
                    "skn": {
                        "image": "https://flex-dev.example.com/skn/v1/card/default/259bb1e563.jpg"
                    },
                    "snapchat": {
                        "image": "https://flex-dev.example.com/skn/v1/card/snapchat/259bb1e563.png"
                    },
                    "social": {
                        "image": "https://flex-dev.example.com/skn/v1/card/og/259bb1e563.png"
                    }
                }
            },
            {
                "thumbprint": "675e2c7898",
                "token": "675e2c7898",
                "cardJson": null,
                "version": "1",
                "flexHost": "https://flex-dev.example.com",
                "sknappHost": "https://app-dev.example.com",
                "certVersion": "v1",
                "saleQty": 1,
                "issue": 1,
                "maxQty": 10000,
                "maximum": 10000,
                "source": "GIVEAWAY",
                "nftState": "MINTED",
                "platform": "SKN",
                "platformCode": "SKN",
                "claimCode": "tetrahedron-v3",
                "giveaway": "tetrahedron-v3",
                "name": "Common Tetrahedron",
                "description": "The fire element. Simplest of all polyhedra, strongest of all pyramids, the tetrahedron has only four prickly vertices.",
                "brandCode": "TEST",
                "brand": "TEST",
                "stockKeepingUnitCode": "TEST-TETRAHEDRON-COMMON-V3",
                "sku": "TEST-TETRAHEDRON-COMMON-V3",
                "tier": "GIVEAWAY",
                "recommendedRetailPrice": 0,
                "rrp": 0,
                "created": "2022-05-31T16:14:32.253Z",
                "rarity": 1,
                "media": {
                    "info": {
                        "image": "https://flex-dev.example.com/skn/v1/back/default/675e2c7898.jpg"
                    },
                    "model": {
                        "config": "https://assets.example.com/sku.v1.3DConfig.TEST-TETRAHEDRON-COMMON-V3.json",
                        "glb": "https://assets.example.com/sku.v1.3DView.TEST-TETRAHEDRON-COMMON-V3.glb"
                    },
                    "skn": {
                        "image": "https://flex-dev.example.com/skn/v1/card/default/675e2c7898.jpg"
                    },
                    "snapchat": {
                        "image": "https://flex-dev.example.com/skn/v1/card/snapchat/675e2c7898.png"
                    },
                    "social": {
                        "image": "https://flex-dev.example.com/skn/v1/card/og/675e2c7898.png"
                    }
                }
            }
        ]);
    })
})
