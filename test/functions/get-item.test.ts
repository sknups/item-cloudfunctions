import './test-env';

import { Request } from '@google-cloud/functions-framework';
import * as MockExpressResponse from 'mock-express-response';
import { getItem } from '../../src';
import { StatusCodes } from 'http-status-codes';
import { ItemRepository } from '../../src/persistence/item-repository';
import { SALE_ENTITY_FULL, SALE_ENTITY_MINTED } from '../mocks-item';
import { ItemNftState, ItemSource } from '../../src/dto/item.dto';
import { LegacyRetailerItemDto } from '../../src/dto/item-retailer.dto';
import { InternalItemDto } from '../../src/dto/item-internal.dto';
import { ItemMediaTypeDto } from '../../src/dto/item-media-type.dto';

const SALE_DTO_RETAIL: LegacyRetailerItemDto = {
  "token": "338a6b3128",
  "thumbprint": "338a6b3128",
  "flexHost": "https://flex-dev.example.com",
  "sknappHost": "https://app-dev.example.com",
  "issue": 14,
  "saleQty": 14,
  "maximum": 10000,
  "maxQty": 10000,
  "giveaway": "test123",
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
      "type": ItemMediaTypeDto.IMAGE,
      "image": {
        "jpeg": "https://flex-dev.example.com/skn/v1/primary/338a6b3128.jpg",
        "png": "https://flex-dev.example.com/skn/v1/primary/338a6b3128.png",
        "webp": "https://flex-dev.example.com/skn/v1/primary/338a6b3128.webp"
      }
    },
    "secondary": [
      {
        "type": ItemMediaTypeDto.IMAGE,
        "image": {
          "jpeg": "https://flex-dev.example.com/skn/v1/secondary/0/338a6b3128.jpg",
          "png": "https://flex-dev.example.com/skn/v1/secondary/0/338a6b3128.png",
          "webp": "https://flex-dev.example.com/skn/v1/secondary/0/338a6b3128.webp"
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

const SALE_DTO_INTERNAL: InternalItemDto = {
  "token": "338a6b3128",
  "issue": 14,
  "maximum": 10000,
  "giveaway": "test123",
  "description": "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
  "brand": "TEST",
  "sku": "TEST-OCTAHEDRON-COMMON",
  "name": "Common Octahedron",
  "rarity": 1,
  "version": "1",
  "created": "2022-07-12T10:37:19.335Z",
  "platform": "TEST",
  "nftState": ItemNftState.UNMINTED,
  "rrp": 100,
  "source": ItemSource.SALE,
  "tier": "GREEN",
  "cardJson": "{\"back\": {\"token\": {\"color\": \"#FFFFFFFF\",\"font-size\": \"25pt\",\"font-family\": \"ShareTechMono-Regular\",\"font-weight\": \"Regular\",\"x\": 470,\"y\": 340}}}",
  "nftAddress": null,
  "ownerAddress": null,
  "media": null,
}

const instance = getItem;

describe('function - get-item - retailer', () => {

  const byThumbprintSpy = jest.spyOn(ItemRepository.prototype, 'byThumbprint');

  const platform = "SKN";
  const token = "338a6b3128";
  const req = {
    method: 'GET',
    path: `/retailer/${platform}/${token}`,
  } as Request;

  let res = new MockExpressResponse();

  beforeEach(() => {
    res = new MockExpressResponse();
    byThumbprintSpy.mockReturnValueOnce(Promise.resolve({ ...SALE_ENTITY_FULL, claimCode: 'test123', stockKeepingUnitRarity: 1 }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('asserts \'platform\' and \'token\' required', async () => {
    const req = { method: 'GET', path: '' } as Request;

    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res._getString()).toContain('platform code and ownership token (or nft.address) must be provided in path');
  });

  it('ignores path additional element', async () => {
    const req = {
      method: 'GET',
      path: `/retailer/bla/${platform}/${token}`,
    } as Request;

    await instance(req, res);

    expect(byThumbprintSpy).toHaveBeenCalledTimes(1);
    expect(byThumbprintSpy).toHaveBeenLastCalledWith(platform, token);
  });

  it('returns item', async () => {
    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(byThumbprintSpy).toHaveBeenCalledTimes(1);
    expect(byThumbprintSpy).toHaveBeenLastCalledWith(platform, token);
    expect(res._getJSON()).toEqual(SALE_DTO_RETAIL);
  });

  it('returns 404 if item not found', async () => {
    byThumbprintSpy.mockReset();
    byThumbprintSpy.mockReturnValueOnce(Promise.resolve(null));

    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(res._getString()).toEqual('Not Found');
  })

});


describe('function - get-item - internal', () => {
  const byThumbprintSpy = jest.spyOn(ItemRepository.prototype, 'byThumbprint');
  const byNftAddressSpy = jest.spyOn(ItemRepository.prototype, 'byNftAddress');

  const platform = "SKN";
  const token = "338a6b3128";
  const req = {
    method: 'GET',
    path: `/${platform}/${token}`,
  } as Request;

  let res = new MockExpressResponse();

  beforeEach(() => {
    res = new MockExpressResponse();
    byThumbprintSpy.mockReturnValueOnce(Promise.resolve({ ...SALE_ENTITY_FULL, claimCode: 'test123', stockKeepingUnitRarity: 1 }));
    byNftAddressSpy.mockReturnValueOnce(Promise.resolve({ ...SALE_ENTITY_MINTED, claimCode: 'test123', stockKeepingUnitRarity: 1 }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('supports item with null card', async () => {
    byThumbprintSpy.mockReset();
    byThumbprintSpy.mockReturnValueOnce(Promise.resolve({ ...SALE_ENTITY_FULL, claimCode: 'test123', stockKeepingUnitRarity: 1, card: null }));

    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(res._getJSON()).toEqual({ ...SALE_DTO_INTERNAL, cardJson: null });
  });

  it('returns item', async () => {
    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(byThumbprintSpy).toHaveBeenCalledTimes(1);
    expect(byThumbprintSpy).toHaveBeenLastCalledWith(platform, token);
    expect(res._getJSON()).toEqual(SALE_DTO_INTERNAL);
  });

  it('returns item by nftAddress', async () => {
    const nftAddress = 'SOL.devnet.abc123';
    req.path = `/_NFT_/${nftAddress}`;

    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(byThumbprintSpy).toHaveBeenCalledTimes(0);
    expect(byNftAddressSpy).toHaveBeenCalledTimes(1);
    expect(byNftAddressSpy).toHaveBeenLastCalledWith(nftAddress);
    expect(res._getJSON()).toEqual({
      ...SALE_DTO_INTERNAL,
      nftAddress: 'SOL.devnet.12345',
      nftState: 'MINTED',
      ownerAddress: 'SOL.devnet.67890',
    });
  });
});
