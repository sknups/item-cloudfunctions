import { ItemEntity, ProjectedItemEntity } from '../src/entity/item.entity';

export const SALE_ENTITY: ProjectedItemEntity = {
  brandCode: 'TEST',
  card: '{"back": {"token": {"color": "#FFFFFFFF","font-size": "25pt","font-family": "ShareTechMono-Regular","font-weight": "Regular","x": 470,"y": 340}}}',
  claimCode: null,
  created: new Date(1657622239335),
  description: 'The air element. Octahedra are sparkling crystals of diamond, and magnetite.',
  emailHash: '495a8c7b1ab6fd611377ba81fe75cdead63f0ebe88a9260806a3fba790400805',
  key: '338a6b3128',
  maxQty: 10000,
  saleQty: 14,
  nftState: 'UNMINTED',
  ownerAddress: null,
  platformCode: 'TEST',
  recommendedRetailPrice: 100,
  skn: 'STATIC',
  source: 'SALE',
  stockKeepingUnitCode: 'TEST-OCTAHEDRON-COMMON',
  stockKeepingUnitName: 'Common Octahedron',
  stockKeepingUnitRarity: null,
  tier: 'GREEN',
  user: 'abc123',
  version: '1',
  state: 'UNBOXED',
  media: '{}'
};

export const SALE_ENTITY_FULL: ItemEntity = {
  ...SALE_ENTITY,
  updated: SALE_ENTITY.created,
  brandName: 'TEST',
  brandWholesalePrice: 80,
  brandWholesalerShare: 50,
  nftAddress: null,
  media: '{}'
}

export const SALE_ENTITY_MINTED: ItemEntity = {
  ...SALE_ENTITY_FULL,
  nftState: 'MINTED',
  nftAddress: 'SOL.devnet.12345',
  ownerAddress: 'SOL.devnet.67890',
}

export const GIVEAWAY_ENTITY: ProjectedItemEntity = {
  brandCode: 'TEST',
  card: null,
  claimCode: 'claim-123',
  created: new Date(1654013672253),
  description: 'The only regular solid which tessellates Euclidean space: the hexahedron.  The ancients believed this caused the solidity of the Earth.',
  emailHash: '495a8c7b1ab6fd611377ba81fe75cdead63f0ebe88a9260806a3fba790400805',
  key: '07e6554733',
  maxQty: 100,
  saleQty: 8,
  nftState: 'UNMINTED',
  ownerAddress: null,
  platformCode: 'TEST',
  recommendedRetailPrice: 1000,
  skn: 'STATIC',
  source: 'GIVEAWAY',
  stockKeepingUnitCode: 'TEST-CUBE-RARE',
  stockKeepingUnitName: 'Rare Cube',
  stockKeepingUnitRarity: null,
  tier: 'GREEN',
  user: 'abc123',
  version: '1',
  state: 'UNBOXED',
  media: '{}'
};
