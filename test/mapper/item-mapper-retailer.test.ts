import "reflect-metadata";
import { RetailerItemMapper } from "../../src/mapper/retailer/item-mapper-retailer";
import { ProjectedItemEntity } from '../../src/entity/item.entity';
import { ItemNftState, ItemSource } from '../../src/dto/item.dto';
import { LegacyRetailerItemDto } from '../../src/dto/retailer/item-retailer.dto';
import { RetailerItemMediaTypeDto } from '../../src/dto/retailer/item-media-retailer.dto';

const ENTITY1: ProjectedItemEntity = {
  key: '338a6b3128',
  brandCode: 'TEST',
  card: '{\"front\":[{\"text\":\"${issue} of ${maximum}\",\"color\":\"#FFFFFFFF\",\"size\":\"30pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1310}],\"back\":[{\"text\":\"OWNERSHIP TOKEN:\",\"color\":\"#FFFFFFFF\",\"size\":\"25pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1260},{\"text\":\"${token}\",\"color\":\"#FFFFFFFF\",\"size\":\"30pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1310}]}',
  claimCode: 'test123',
  created: new Date(1657622239335),
  description: 'The air element. Octahedra are sparkling crystals of diamond, and magnetite.',
  emailHash: 'emailHash',
  maxQty: 10000,
  nftState: 'UNMINTED',
  ownerAddress: null,
  platformCode: 'SKN',
  recommendedRetailPrice: 100,
  saleQty: 14,
  skn: 'DYNAMIC',
  source: 'SALE',
  state: 'UNBOXED',
  stockKeepingUnitCode: 'TEST-OCTAHEDRON-COMMON',
  stockKeepingUnitName: 'Common Octahedron',
  stockKeepingUnitRarity: 1,
  tier: 'PREMIUM',
  user: 'user123',
  version: '1',
  media: null,
}

const DTO1: LegacyRetailerItemDto = {
  "brand": "TEST",
  "brandCode": "TEST",
  "certVersion": "v1",
  "claimCode": "test123",
  "created": "2022-07-12T10:37:19.335Z",
  "description": "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
  "flexHost": "https://flex-dev.sknups.com",
  "giveaway": "test123",
  "issue": 14,
  "maxQty": 10000,
  "maximum": 10000,
  "media": {
    "primary": {
      "type": RetailerItemMediaTypeDto.IMAGE,
      "image": {
        "jpeg": "https://flex-dev.sknups.com/skn/v1/primary/default/338a6b3128.jpg",
        "png": "https://flex-dev.sknups.com/skn/v1/primary/default/338a6b3128.png",
        "webp": "https://flex-dev.sknups.com/skn/v1/primary/default/338a6b3128.webp"
      }
    },
    "secondary": [
      {
        "type": RetailerItemMediaTypeDto.IMAGE,
        "image": {
          "jpeg": "https://flex-dev.sknups.com/skn/v1/secondary/0/default/338a6b3128.jpg",
          "png": "https://flex-dev.sknups.com/skn/v1/secondary/0/default/338a6b3128.png",
          "webp": "https://flex-dev.sknups.com/skn/v1/secondary/0/default/338a6b3128.webp"
        }
      }
    ],
    "social": {
      "default": {
        "image": {
          "jpeg": "https://flex-dev.sknups.com/skn/v1/primary/og/338a6b3128.jpg",
          "png": "https://flex-dev.sknups.com/skn/v1/primary/og/338a6b3128.png",
          "webp": "https://flex-dev.sknups.com/skn/v1/primary/og/338a6b3128.webp"
        }
      },
      "snapchat": {
        "image": {
          "jpeg": "https://flex-dev.sknups.com/skn/v1/primary/snapsticker/338a6b3128.jpg",
          "png": "https://flex-dev.sknups.com/skn/v1/primary/snapsticker/338a6b3128.png",
          "webp": "https://flex-dev.sknups.com/skn/v1/primary/snapsticker/338a6b3128.webp"
        }
      }
    },
    "model": {
      "glb": "https://assets.example.com/sku.v1.3DView.TEST-OCTAHEDRON-COMMON.glb",
      "config": "https://assets.example.com/sku.v1.3DConfig.TEST-OCTAHEDRON-COMMON.json"
    }
  },
  "name": "Common Octahedron",
  "nftState": ItemNftState.UNMINTED,
  "platform": "SKN",
  "platformCode": "SKN",
  "rarity": 1,
  "recommendedRetailPrice": 100,
  "rrp": 100,
  "saleQty": 14,
  "sknappHost": "https://app-dev.sknups.com",
  "sku": "TEST-OCTAHEDRON-COMMON",
  "source": ItemSource.SALE,
  "stockKeepingUnitCode": "TEST-OCTAHEDRON-COMMON",
  "thumbprint": "338a6b3128",
  "tier": "PREMIUM",
  "token": "338a6b3128",
  "version": "1"
}

describe('mapper - item - retailer', () => {

  const instance = new RetailerItemMapper(
    "https://assets.example.com",
    "https://flex-dev.sknups.com",
    "https://app-dev.sknups.com",
  );

  it('creates item dto structure - STATIC', () => {
    expect(instance.toDto(ENTITY1)).toEqual(DTO1)
  });

  it('creates item dto structure - DYNAMIC', () => {
    expect(instance.toDto({ ...ENTITY1, skn: 'DYNAMIC' })).toEqual(DTO1)
  });

  it('can handle numeric timestamp', () => {
    expect(instance.toDto({ ...ENTITY1, created: new Date(1657622239335) })).toEqual(DTO1);
  });

  it('generates \'VIDEO\' media structure', () => {
    expect(instance.toDto({ ...ENTITY1, skn: 'VIDEO' })).toEqual({
      "brand": "TEST",
      "brandCode": "TEST",
      "certVersion": "v1",
      "claimCode": "test123",
      "created": "2022-07-12T10:37:19.335Z",
      "description": "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
      "flexHost": "https://flex-dev.sknups.com",
      "giveaway": "test123",
      "issue": 14,
      "maxQty": 10000,
      "maximum": 10000,
      "media": {
        "primary": {
          "type": "VIDEO",
          "image": {
            "jpeg": "https://assets.example.com/sku.TEST-OCTAHEDRON-COMMON.primary.jpg",
            "png": "https://assets.example.com/sku.TEST-OCTAHEDRON-COMMON.primary.png",
            "webp": "https://assets.example.com/sku.TEST-OCTAHEDRON-COMMON.primary.webp"
          },
          "video": {
            "mp4": "https://assets.example.com/sku.TEST-OCTAHEDRON-COMMON.primary.mp4"
          }
        },
        "secondary": [
          {
            "type": "IMAGE",
            "image": {
              "jpeg": "https://flex-dev.sknups.com/skn/v1/secondary/0/default/338a6b3128.jpg",
              "png": "https://flex-dev.sknups.com/skn/v1/secondary/0/default/338a6b3128.png",
              "webp": "https://flex-dev.sknups.com/skn/v1/secondary/0/default/338a6b3128.webp"
            }
          }
        ],
        "social": {
          "default": {
            "image": {
              "jpeg": "https://flex-dev.sknups.com/skn/v1/primary/og/338a6b3128.jpg",
              "png": "https://flex-dev.sknups.com/skn/v1/primary/og/338a6b3128.png",
              "webp": "https://flex-dev.sknups.com/skn/v1/primary/og/338a6b3128.webp"
            }
          },
          "snapchat": {
            "image": {
              "jpeg": "https://flex-dev.sknups.com/skn/v1/primary/snapsticker/338a6b3128.jpg",
              "png": "https://flex-dev.sknups.com/skn/v1/primary/snapsticker/338a6b3128.png",
              "webp": "https://flex-dev.sknups.com/skn/v1/primary/snapsticker/338a6b3128.webp"
            }
          }
        },
        "model": {
          "glb": "https://assets.example.com/sku.v1.3DView.TEST-OCTAHEDRON-COMMON.glb",
          "config": "https://assets.example.com/sku.v1.3DConfig.TEST-OCTAHEDRON-COMMON.json"
        }
      },
      "name": "Common Octahedron",
      "nftState": "UNMINTED",
      "platform": "SKN",
      "platformCode": "SKN",
      "rarity": 1,
      "recommendedRetailPrice": 100,
      "rrp": 100,
      "saleQty": 14,
      "sknappHost": "https://app-dev.sknups.com",
      "sku": "TEST-OCTAHEDRON-COMMON",
      "source": "SALE",
      "stockKeepingUnitCode": "TEST-OCTAHEDRON-COMMON",
      "thumbprint": "338a6b3128",
      "tier": "PREMIUM",
      "token": "338a6b3128",
      "version": "1"
    })
  });

  it('throws error if skn is not \'DYNAMIC\' or \'VIDEO\'', () => {
    expect(() => {
      instance.toDto({ ...ENTITY1, skn: 'STATIC' })
    }).toThrow("Unsupported legacy skn value 'STATIC'");
  });

});
