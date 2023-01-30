import "reflect-metadata";
import { InternalItemMapper } from "../../src/mapper/internal/item-mapper-internal";
import { ItemEntity, ProjectedItemEntity } from '../../src/entity/item.entity';
import { ItemNftState, ItemSource } from '../../src/dto/item.dto';
import { InternalItemDto } from '../../src/dto/internal/item-internal.dto';
import { InternalItemMediaTypeDto } from '../../src/dto/internal/item-media-internal.dto';

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

const ENTITY1_FULL: ItemEntity = {
  ...ENTITY1,
  updated: ENTITY1.created,
  brandName: 'TEST',
  brandWholesalePrice: 80,
  brandWholesalerShare: 50,
  nftAddress: null,
}

const DTO1_INTERNAL: InternalItemDto = {
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
  "platform": "SKN",
  "nftState": ItemNftState.UNMINTED,
  "rrp": 100,
  "source": ItemSource.SALE,
  "tier": "PREMIUM",
  "cardJson": "{\"front\":[{\"text\":\"${issue} of ${maximum}\",\"color\":\"#FFFFFFFF\",\"size\":\"30pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1310}],\"back\":[{\"text\":\"OWNERSHIP TOKEN:\",\"color\":\"#FFFFFFFF\",\"size\":\"25pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1260},{\"text\":\"${token}\",\"color\":\"#FFFFFFFF\",\"size\":\"30pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1310}]}",
  "nftAddress": null,
  "ownerAddress": null,
  "media": {
    "primary": {
      "type": InternalItemMediaTypeDto.DYNAMIC,
      "labels": [{ "text": "${issue} of ${maximum}", "color": "#FFFFFFFF", "size": "30pt", "font": "Share Tech Mono", "weight": "Regular", "align": "center", "x": 450, "y": 1310 }],
    },
    "secondary": [{
      "type": InternalItemMediaTypeDto.DYNAMIC,
      "labels": [{ "text": "OWNERSHIP TOKEN:", "color": "#FFFFFFFF", "size": "25pt", "font": "Share Tech Mono", "weight": "Regular", "align": "center", "x": 450, "y": 1260 }, { "text": "${token}", "color": "#FFFFFFFF", "size": "30pt", "font": "Share Tech Mono", "weight": "Regular", "align": "center", "x": 450, "y": 1310 }]
    }]
  },
}

describe('mapper - item - internal', () => {

  const instance = new InternalItemMapper();

  it('creates item dto structure', () => {
    expect(instance.toDto(ENTITY1_FULL)).toEqual(DTO1_INTERNAL)
  });

  it('can handle numeric timestamp', () => {
    expect(instance.toDto({ ...ENTITY1_FULL, created: new Date(1657622239335) })).toEqual(DTO1_INTERNAL);
  });

});
