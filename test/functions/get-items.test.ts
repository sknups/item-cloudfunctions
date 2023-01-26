import './test-env';
process.env.EMAIL_HASHING_SECRET = 'shhh this is a secret';

import { getItems } from '../../src';
import { Request } from '@google-cloud/functions-framework';
import * as MockExpressResponse from 'mock-express-response';
import { StatusCodes } from 'http-status-codes';
import { ItemRepository } from '../../src/persistence/item-repository';
import { GIVEAWAY_ENTITY, SALE_ENTITY } from '../mocks-item';
import { ItemNftState, ItemSource } from '../../src/dto/item.dto';
import { LegacyRetailerItemDto } from '../../src/dto/item-retailer.dto';

const SALE_DTO: LegacyRetailerItemDto = {
  "token": "338a6b3128",
  "thumbprint": "338a6b3128",
  "flexHost": "https://flex-dev.example.com",
  "sknappHost": "https://app-dev.example.com",
  "issue": 14,
  "saleQty": 14,
  "maximum": 10000,
  "maxQty": 10000,
  "giveaway": null,
  "description": "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
  "brand": "TEST",
  "brandCode": "TEST",
  "sku": "TEST-OCTAHEDRON-COMMON",
  "stockKeepingUnitCode": "TEST-OCTAHEDRON-COMMON",
  "name": "Common Octahedron",
  "rarity": null,
  "version": "1",
  "claimCode": null,
  "created": "2022-07-12T10:37:19.335Z",
  "platform": "TEST",
  "platformCode": "TEST",
  "certVersion": "v1",
  "nftState": ItemNftState.UNMINTED,
  "recommendedRetailPrice": 100,
  "rrp": 100,
  "source": ItemSource.SALE,
  "tier": "GREEN",
  "media": {
    "primary": {
      "type": "IMAGE",
      "image": {
        "jpeg": "https://flex-dev.example.com/skn/v1/card/default/338a6b3128.jpg",
        "png": "https://flex-dev.example.com/skn/v1/card/default/338a6b3128.png",
        "webp": "https://flex-dev.example.com/skn/v1/card/default/338a6b3128.webp"
      }
    },
    "secondary": [
      {
        "type": "IMAGE",
        "image": {
          "jpeg": "https://flex-dev.example.com/skn/v1/back/default/338a6b3128.jpg",
          "png": "https://flex-dev.example.com/skn/v1/back/default/338a6b3128.png",
          "webp": "https://flex-dev.example.com/skn/v1/back/default/338a6b3128.webp"
        }
      }
    ],
    "social": {
      "default": {
        "image": {
          "jpeg": "https://flex-dev.example.com/skn/v1/card/og/338a6b3128.jpg",
          "png": "https://flex-dev.example.com/skn/v1/card/og/338a6b3128.png",
          "webp": "https://flex-dev.example.com/skn/v1/card/og/338a6b3128.webp"
        }
      },
      "snapchat": {
        "image": {
          "jpeg": "https://flex-dev.example.com/skn/v1/card/snapchat/338a6b3128.jpg",
          "png": "https://flex-dev.example.com/skn/v1/card/snapchat/338a6b3128.png",
          "webp": "https://flex-dev.example.com/skn/v1/card/snapchat/338a6b3128.webp"
        }
      }
    },
    "model": {
      "glb": "https://assets-dev.example.com/sku.v1.3DView.TEST-OCTAHEDRON-COMMON.glb",
      "config": "https://assets-dev.example.com/sku.v1.3DConfig.TEST-OCTAHEDRON-COMMON.json"
    }
  }
};

const GIVEAWAY_DTO: LegacyRetailerItemDto = {
  "thumbprint": "07e6554733",
  "token": "07e6554733",
  "version": "1",
  "flexHost": "https://flex-dev.example.com",
  "sknappHost": "https://app-dev.example.com",
  "certVersion": "v1",
  "saleQty": 8,
  "issue": 8,
  "maxQty": 100,
  "maximum": 100,
  "source": ItemSource.GIVEAWAY,
  "nftState": ItemNftState.UNMINTED,
  "platform": "TEST",
  "platformCode": "TEST",
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
  "rarity": null,
  "media": {
    "primary": {
      "type": "VIDEO",
      "image": {
        "jpeg": "https://assets-dev.example.com/sku.TEST-CUBE-RARE.skn.jpg",
        "png": "https://assets-dev.example.com/sku.TEST-CUBE-RARE.skn.png",
        "webp": "https://assets-dev.example.com/sku.TEST-CUBE-RARE.skn.webp"
      },
      "video": {
        "mp4": "https://assets-dev.example.com/sku.TEST-CUBE-RARE.skn.mp4"
      }
    },
    "secondary": [
      {
        "type": "IMAGE",
        "image": {
          "jpeg": "https://flex-dev.example.com/skn/v1/back/default/07e6554733.jpg",
          "png": "https://flex-dev.example.com/skn/v1/back/default/07e6554733.png",
          "webp": "https://flex-dev.example.com/skn/v1/back/default/07e6554733.webp"
        }
      }
    ],
    "social": {
      "default": {
        "image": {
          "jpeg": "https://flex-dev.example.com/skn/v1/card/og/07e6554733.jpg",
          "png": "https://flex-dev.example.com/skn/v1/card/og/07e6554733.png",
          "webp": "https://flex-dev.example.com/skn/v1/card/og/07e6554733.webp"
        }
      },
      "snapchat": {
        "image": {
          "jpeg": "https://flex-dev.example.com/skn/v1/card/snapchat/07e6554733.jpg",
          "png": "https://flex-dev.example.com/skn/v1/card/snapchat/07e6554733.png",
          "webp": "https://flex-dev.example.com/skn/v1/card/snapchat/07e6554733.webp"
        }
      }
    },
    "model": {
      "glb": "https://assets-dev.example.com/sku.v1.3DView.TEST-CUBE-RARE.glb",
      "config": "https://assets-dev.example.com/sku.v1.3DConfig.TEST-CUBE-RARE.json"
    }
  }
};

const instance = getItems;

describe('function - get-items', () => {

  const byEmailHashSpy = jest.spyOn(ItemRepository.prototype, 'byEmailHash');
  const byWalletAddressSpy = jest.spyOn(ItemRepository.prototype, 'byWalletAddress');
  const byUserSpy = jest.spyOn(ItemRepository.prototype, 'byUser');

  let res = new MockExpressResponse();

  beforeEach(() => {
    res = new MockExpressResponse();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('asserts \'platformCode\' required', async () => {
    const req = { method: 'POST', body: {} } as Request;

    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res._getString()).toContain('platformCode should not be empty');
  });

  it('asserts \'emailAddress\', \'blockchainAddress\' or \'user\' required ', async () => {
    const req = {
      method: 'POST', body: {
        platformCode: 'TEST',
      }
    } as Request;

    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res._getString()).toContain('\'emailAddress\' missing. must supply at least emailAddress, user or blockchainAddress');
    expect(res._getString()).toContain('\'user\' missing. must supply at least emailAddress, user or blockchainAddress');
    expect(res._getString()).toContain('\'blockchainAddress\' missing. must supply at least emailAddress, user or blockchainAddress');
  });

  it('gets items from \'emailAddress\'', async () => {
    const req = {
      method: 'POST', body: {
        platformCode: 'TEST',
        emailAddress: 'user@example.com'
      }
    } as Request;

    byEmailHashSpy.mockReturnValueOnce(Promise.resolve([SALE_ENTITY, { ...GIVEAWAY_ENTITY, skn: 'VIDEO' }]));

    await instance(req, res);

    const platform = 'TEST';
    const emailHash = '495a8c7b1ab6fd611377ba81fe75cdead63f0ebe88a9260806a3fba790400805';

    expect(byEmailHashSpy).toHaveBeenCalledTimes(1);
    expect(byEmailHashSpy).toHaveBeenLastCalledWith(platform, emailHash);
    expect(byWalletAddressSpy).toHaveBeenCalledTimes(0);
    expect(byUserSpy).toHaveBeenCalledTimes(0);

    expect(res._getJSON()).toEqual([SALE_DTO, GIVEAWAY_DTO]);
  });

  it('gets items from \'blockchainAddress\' ', async () => {
    const req = {
      method: 'POST', body: {
        platformCode: 'TEST',
        blockchainAddress: 'SOL.devnet.5KNMRFwPbPhhAnxJJby5PDo454rrKDuoHuJf9cNa7XUW'
      }
    } as Request;

    byWalletAddressSpy.mockReturnValueOnce(Promise.resolve([SALE_ENTITY, { ...GIVEAWAY_ENTITY, skn: 'VIDEO' }]));

    await instance(req, res);

    const platform = 'TEST';
    const walletAddress = 'SOL.devnet.5KNMRFwPbPhhAnxJJby5PDo454rrKDuoHuJf9cNa7XUW';
    expect(byWalletAddressSpy).toHaveBeenCalledTimes(1);
    expect(byWalletAddressSpy).toHaveBeenLastCalledWith(platform, walletAddress);
    expect(byUserSpy).toHaveBeenCalledTimes(0);
    expect(byEmailHashSpy).toHaveBeenCalledTimes(0);

    expect(res._getJSON()).toEqual([SALE_DTO, GIVEAWAY_DTO]);
  });

  it('gets items from \'user\' ', async () => {
    const platform = 'TEST';
    const user = 'abc123456';

    const req = {
      method: 'POST', body: {
        platformCode: platform,
        user: user
      }
    } as Request;

    byUserSpy.mockReturnValueOnce(Promise.resolve([SALE_ENTITY, { ...GIVEAWAY_ENTITY, skn: 'VIDEO' }]));

    await instance(req, res);

    expect(byUserSpy).toHaveBeenCalledTimes(1);
    expect(byUserSpy).toHaveBeenLastCalledWith(platform, user);
    expect(byWalletAddressSpy).toHaveBeenCalledTimes(0);
    expect(byEmailHashSpy).toHaveBeenCalledTimes(0);

    expect(res._getJSON()).toEqual([SALE_DTO, GIVEAWAY_DTO]);
  });

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

    byEmailHashSpy.mockReturnValueOnce(Promise.resolve([
      SALE_ENTITY,
      { ...GIVEAWAY_ENTITY, skn: 'VIDEO' },
    ]));
    byUserSpy.mockReturnValueOnce(Promise.resolve([
      SALE_ENTITY, // duplicate
      { ...GIVEAWAY_ENTITY, key: '111', skn: 'VIDEO' },
    ]));
    byWalletAddressSpy.mockReturnValueOnce(Promise.resolve([
      { ...SALE_ENTITY, key: '222' },
      { ...GIVEAWAY_ENTITY, key: '333', skn: 'VIDEO' },
    ]));

    await instance(req, res);

    expect(byUserSpy).toHaveBeenCalledTimes(1);
    expect(byUserSpy).toHaveBeenLastCalledWith(platform, user);
    expect(byWalletAddressSpy).toHaveBeenCalledTimes(1);
    expect(byWalletAddressSpy).toHaveBeenLastCalledWith(platform, blockchainAddress);
    expect(byEmailHashSpy).toHaveBeenCalledTimes(1);
    expect(byEmailHashSpy).toHaveBeenLastCalledWith(platform, '495a8c7b1ab6fd611377ba81fe75cdead63f0ebe88a9260806a3fba790400805');

    const dto111 = { ...GIVEAWAY_DTO, thumbprint: '111', token: '111' };
    const dto222 = { ...SALE_DTO, thumbprint: '222', token: '222' };
    const dto333 = { ...GIVEAWAY_DTO, thumbprint: '333', token: '333' };

    for (const dto of [dto111, dto222, dto333]) {
      const oldMediaJson = JSON.stringify(dto.media);
      let newMediaJson = oldMediaJson;
      while (newMediaJson.includes('338a6b3128') || newMediaJson.includes('07e6554733')) {
        newMediaJson = newMediaJson.replace(/338a6b3128|07e6554733/, dto.token);
      }
      dto.media = JSON.parse(newMediaJson);
    }

    expect(res._getJSON()).toEqual([
      SALE_DTO,
      GIVEAWAY_DTO,
      dto111,
      dto222,
      dto333,
    ]);
  });

});
