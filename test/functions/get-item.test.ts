import './test-env';

import { Request } from '@google-cloud/functions-framework';
import * as MockExpressResponse from 'mock-express-response';
import { getItem } from '../../src';
import { StatusCodes } from 'http-status-codes';
import { ItemRepository } from '../../src/persistence/item-repository';
import { SALE_ENTITY } from '../mocks-item';
import { ItemNftState, ItemSource, LegacyItemDto } from '../../src/dto/item.dto';

const SALE_DTO: LegacyItemDto = {
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
  "platform": "TEST",
  "platformCode": "TEST",
  "certVersion": "v1",
  "nftState": ItemNftState.UNMINTED,
  "recommendedRetailPrice": 100,
  "rrp": 100,
  "source": ItemSource.SALE,
  "tier": "GREEN",
  "media": {
    "info": {
      "image": "https://flex-dev.example.com/skn/v1/back/default/338a6b3128.jpg"
    },
    "model": {
      "config": "https://assets-dev.example.com/sku.v1.3DConfig.TEST-OCTAHEDRON-COMMON.json",
      "glb": "https://assets-dev.example.com/sku.v1.3DView.TEST-OCTAHEDRON-COMMON.glb"
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
};

const instance = getItem;

describe('function - get-item', () => {

  const byThumbprintSpy = jest.spyOn(ItemRepository.prototype, 'byThumbprint');

  const platform = "SKN";
  const token = "338a6b3128";
  const req = {
    method: 'GET',
    path: `/${platform}/${token}`,
  } as Request;

  let res = new MockExpressResponse();

  beforeEach(() => {
    res = new MockExpressResponse();
    byThumbprintSpy.mockReturnValueOnce(Promise.resolve({ ...SALE_ENTITY, claimCode: 'test123', stockKeepingUnitRarity: 1 }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('asserts \'platform\' and \'token\' required', async () => {
    const req = { method: 'GET', path: '' } as Request;

    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res._getString()).toContain('platform code and ownership token must be provided in path');
  });

  it('ignores path additional element', async () => {
    const req = {
      method: 'GET',
      path: `/bla/${platform}/${token}`,
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
    expect(res._getJSON()).toEqual(SALE_DTO);
  });

  it('supports item with null card', async () => {
    byThumbprintSpy.mockReset();
    byThumbprintSpy.mockReturnValueOnce(Promise.resolve({ ...SALE_ENTITY, claimCode: 'test123', stockKeepingUnitRarity: 1, card: null }));

    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(res._getJSON()).toEqual({ ...SALE_DTO, cardJson: null });
  });

  it('returns 404 if item not found', async () => {
    byThumbprintSpy.mockReset();
    byThumbprintSpy.mockReturnValueOnce(Promise.resolve(null));

    await instance(req, res);

    expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(res._getString()).toEqual('Not Found');
  })

});
