import { ItemDTOMapper } from "../../src/mapper/item-mapper";
import { ProjectedItemEntity } from '../../src/entity/item.entity';
import { LegacyItemDto, ItemNftState, ItemSource } from '../../src/dto/item.dto';

const ENTITY1: ProjectedItemEntity = {
  key: '338a6b3128',
  brandCode: 'TEST',
  card: '{"back": {"token": {"color": "#FFFFFFFF","font-size": "25pt","font-family": "ShareTechMono-Regular","font-weight": "Regular","x": 470,"y": 340}}}',
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
  skn: 'STATIC',
  source: 'SALE',
  state: 'UNBOXED',
  stockKeepingUnitCode: 'TEST-OCTAHEDRON-COMMON',
  stockKeepingUnitName: 'Common Octahedron',
  stockKeepingUnitRarity: 1,
  tier: 'PREMIUM',
  user: 'user123',
  version: '1',
}

const DTO1: LegacyItemDto = {
  "brand": "TEST",
  "brandCode": "TEST",
  "cardJson": "{\"back\": {\"token\": {\"color\": \"#FFFFFFFF\",\"font-size\": \"25pt\",\"font-family\": \"ShareTechMono-Regular\",\"font-weight\": \"Regular\",\"x\": 470,\"y\": 340}}}",
  "certVersion": "v1",
  "claimCode": "test123",
  "created": "2022-07-12T10:37:19.335Z",
  "description": "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
  "flexHost": "https://flex-dev.sknups.gg",
  "giveaway": "test123",
  "issue": 14,
  "maxQty": 10000,
  "maximum": 10000,
  "media": {
    "info": {
      "image": "https://flex-dev.sknups.gg/skn/v1/back/default/338a6b3128.jpg"
    },
    "model": {
      "config": "https://assets.example.com/sku.v1.3DConfig.TEST-OCTAHEDRON-COMMON.json",
      "glb": "https://assets.example.com/sku.v1.3DView.TEST-OCTAHEDRON-COMMON.glb"
    },
    "skn": {
      "image": "https://flex-dev.sknups.gg/skn/v1/card/default/338a6b3128.jpg"
    },
    "snapchat": {
      "image": "https://flex-dev.sknups.gg/skn/v1/card/snapchat/338a6b3128.png"
    },
    "social": {
      "image": "https://flex-dev.sknups.gg/skn/v1/card/og/338a6b3128.png"
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
  "sknappHost": "https://app-dev.sknups.gg",
  "sku": "TEST-OCTAHEDRON-COMMON",
  "source": ItemSource.SALE,
  "stockKeepingUnitCode": "TEST-OCTAHEDRON-COMMON",
  "thumbprint": "338a6b3128",
  "tier": "PREMIUM",
  "token": "338a6b3128",
  "version": "1"
}

describe('mapper - item', () => {

  const instance = new ItemDTOMapper(
    "https://assets.example.com",
    "https://flex-dev.sknups.gg",
    "https://app-dev.sknups.gg",
  );

  it('creates item dto structure', () => {
    expect(instance.toDTO(ENTITY1)).toEqual(DTO1)
  });

  it('can handle numeric timestamp', () => {
    expect(instance.toDTO({ ...ENTITY1, created: new Date(1657622239335) })).toEqual(DTO1);
  });

  it('generates \'VIDEO\' media structure', () => {
    expect(instance.toDTO({ ...ENTITY1, skn: 'VIDEO' })).toEqual({
      "brand": "TEST",
      "brandCode": "TEST",
      "cardJson": "{\"back\": {\"token\": {\"color\": \"#FFFFFFFF\",\"font-size\": \"25pt\",\"font-family\": \"ShareTechMono-Regular\",\"font-weight\": \"Regular\",\"x\": 470,\"y\": 340}}}",
      "certVersion": "v1",
      "claimCode": "test123",
      "created": "2022-07-12T10:37:19.335Z",
      "description": "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
      "flexHost": "https://flex-dev.sknups.gg",
      "giveaway": "test123",
      "issue": 14,
      "maxQty": 10000,
      "maximum": 10000,
      "media": {
        "info": {
          "image": "https://flex-dev.sknups.gg/skn/v1/back/default/338a6b3128.jpg"
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
          "image": "https://flex-dev.sknups.gg/skn/v1/card/snapchat/338a6b3128.png"
        },
        "social": {
          "image": "https://flex-dev.sknups.gg/skn/v1/card/og/338a6b3128.png"
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
      "sknappHost": "https://app-dev.sknups.gg",
      "sku": "TEST-OCTAHEDRON-COMMON",
      "source": "SALE",
      "stockKeepingUnitCode": "TEST-OCTAHEDRON-COMMON",
      "thumbprint": "338a6b3128",
      "tier": "PREMIUM",
      "token": "338a6b3128",
      "version": "1"
    })
  });

  it('throws error if skn is not \'STATIC\' or \'VIDEO\'', () => {
    expect(() => {
      instance.toDTO({ ...ENTITY1, skn: 'INVALID' })
    }).toThrow("unsupported skn value 'INVALID'. Must be 'STATIC' or 'VIDEO'")
  });

});