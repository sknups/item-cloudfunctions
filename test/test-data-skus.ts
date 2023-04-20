import { Sku } from '../src/client/catalog/catalog.client';

const GIVEAWAY_SKU_V1: Sku = {
  "code": "GIVEAWAY-V1",
  "brandCode": "TEST",
  "brandName": "TEST",
  "brandWholesalePrice": null,
  "brandWholesalerShare": 0.5,
  "card": null,
  "description": "The only regular solid which tessellates Euclidean space: the hexahedron.  The ancients believed this caused the solidity of the Earth.",
  "maxQty": 1000000,
  "media": null,
  "name": "Common Cube",
  "permissions": [],
  "platformCode": "SKN",
  "rarity": 0,
  "recommendedRetailPrice": null,
  "skn": "DYNAMIC",
  "tier": null,
  "claimable": false,
  "version": "1"
};

const PREMIUM_SKU_V1: Sku = {
  "code": "PREMIUM-V1",
  "brandCode": "TEST",
  "brandName": "TEST",
  "brandWholesalePrice": 1000,
  "brandWholesalerShare": 0.5,
  "card": null,
  "description": "The only regular solid which tessellates Euclidean space: the hexahedron.  The ancients believed this caused the solidity of the Earth.",
  "maxQty": 1000,
  "media": null,
  "name": "Epic Cube",
  "permissions": [],
  "platformCode": "SKN",
  "rarity": 2,
  "recommendedRetailPrice": 1000,
  "skn": "DYNAMIC",
  "tier": null,
  "claimable": false,
  "version": "1"
};

const GIVEAWAY_SKU_V2: Sku = {
  "code": "GIVEAWAY-V2",
  "brandCode": "TEST",
  "brandName": "TEST",
  "brandWholesalePrice": null,
  "brandWholesalerShare": 0.5,
  "card": "{\"back\":[{\"text\":\"${token}\",\"color\":\"#FFFFFFAA\",\"size\":\"30pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1220}]}",
  "description": "The water element. Twenty triangles in a polyhedral soup. In nature, the icosahedron can be seen in the folded structures of bacteriophages and viruses.\n",
  "maxQty": null,
  "media": null,
  "name": "Giveaway Icosahedron",
  "permissions": [],
  "platformCode": "SKN",
  "rarity": null,
  "recommendedRetailPrice": null,
  "skn": "DYNAMIC",
  "tier": "GIVEAWAY",
  "claimable": false,
  "version": "2"
};

const PREMIUM_SKU_V2: Sku = {
  "code": "PREMIUM-V2",
  "brandCode": "TEST",
  "brandName": "TEST",
  "brandWholesalePrice": 1000,
  "brandWholesalerShare": 0.5,
  "card": "{\"front\":[{\"text\":\"${issue}/${maximum}\",\"color\":\"#FFFFFFFF\",\"size\":\"36pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1220}],\"back\":[{\"text\":\"${issue}/${maximum}\",\"color\":\"#FFFFFFFF\",\"size\":\"36pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1205},{\"text\":\"${token}\",\"color\":\"#FFFFFFAA\",\"size\":\"30pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1260}]}",
  "description": "The water element. Twenty triangles in a polyhedral soup. In nature, the icosahedron can be seen in the folded structures of bacteriophages and viruses.\n",
  "maxQty": 10000,
  "media": null,
  "name": "Green Icosahedron",
  "permissions": [],
  "platformCode": "SKN",
  "rarity": null,
  "recommendedRetailPrice": 1000,
  "skn": "DYNAMIC",
  "tier": "GREEN",
  "claimable": false,
  "version": "2"
};

const GIVEAWAY_SKU_V3: Sku = {
  "code": "GIVEAWAY-V3",
  "brandCode": "TEST",
  "brandName": "TEST",
  "brandWholesalePrice": null,
  "brandWholesalerShare": 0.5,
  "card": null,
  "description": "The fire element. Simplest of all polyhedra, strongest of all pyramids, the tetrahedron has only four prickly vertices.",
  "maxQty": null,
  "media": "{\"primary\":{\"type\":\"STATIC\"},\"secondary\":[{\"type\":\"DYNAMIC\",\"labels\":[{\"text\":\"${token}\",\"color\":\"#FFFFFFAA\",\"size\":\"30pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1220}]}]}",
  "name": "Giveaway Tetrahedron",
  "permissions": [],
  "platformCode": "SKN",
  "rarity": null,
  "recommendedRetailPrice": null,
  "skn": null,
  "tier": "GIVEAWAY",
  "claimable": true,
  "version": "3"
};

const PREMIUM_SKU_V3: Sku = {
  "code": "PREMIUM-V3",
  "brandCode": "TEST",
  "brandName": "TEST",
  "brandWholesalePrice": 2000,
  "brandWholesalerShare": 0.5,
  "card": null,
  "description": "The fire element. Simplest of all polyhedra, strongest of all pyramids, the tetrahedron has only four prickly vertices.",
  "maxQty": 10000,
  "media": "{\"primary\":{\"type\":\"DYNAMIC\",\"labels\":[{\"text\":\"${issue}/${maximum}\",\"color\":\"#FFFFFFFF\",\"size\":\"36pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1220}]},\"secondary\":[]}",
  "name": "Green Tetrahedron",
  "permissions": ["METAPLEX_MINT"],
  "platformCode": "SKN",
  "rarity": null,
  "recommendedRetailPrice": 2000,
  "skn": null,
  "tier": "GREEN",
  "claimable": false,
  "version": "3"
};

const DROPLINK_SKU_V3: Sku = {
  "code": "DROPLINK-V3",
  "brandCode": "TEST",
  "brandName": "TEST",
  "brandWholesalePrice": null,
  "brandWholesalerShare": 0.5,
  "card": null,
  "description": "The fire element. Simplest of all polyhedra, strongest of all pyramids, the tetrahedron has only four prickly vertices.",
  "maxQty": 100,
  "media": "{\"primary\":{\"type\":\"STATIC\"},\"secondary\":[{\"type\":\"DYNAMIC\",\"labels\":[{\"text\":\"${token}${issue}${issued}\",\"color\":\"#FFFFFFAA\",\"size\":\"30pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1220}]}]}",
  "name": "Giveaway Tetrahedron",
  "permissions": [],
  "platformCode": "SKN",
  "rarity": null,
  "recommendedRetailPrice": null,
  "skn": null,
  "tier": null,
  "claimable": false,
  "version": "3"
};

export const TEST_SKUS = {
  'GIVEAWAY-V1': GIVEAWAY_SKU_V1,
  'GIVEAWAY-V2': GIVEAWAY_SKU_V2,
  'GIVEAWAY-V3': GIVEAWAY_SKU_V3,
  'PREMIUM-V1': PREMIUM_SKU_V1,
  'PREMIUM-V2': PREMIUM_SKU_V2,
  'PREMIUM-V3': PREMIUM_SKU_V3,
  'DROPLINK-V3': DROPLINK_SKU_V3,

  'PREMIUM-V3-CLAIMABLE': {
    ...PREMIUM_SKU_V3,
    code: 'PREMIUM-V3-CLAIMABLE',
    claimable: true,
  },

  'DROPLINK-V3-CLAIMABLE': {
    ...DROPLINK_SKU_V3,
    code: 'DROPLINK-V3-CLAIMABLE',
    claimable: true,
  },

  'TEST-OCTAHEDRON-GIVEAWAY': {
    ...GIVEAWAY_SKU_V2,
    code: 'TEST-OCTAHEDRON-GIVEAWAY',
  },

  'TEST-TETRAHEDRON-GIVEAWAY': {
    ...GIVEAWAY_SKU_V3,
    code: 'TEST-TETRAHEDRON-GIVEAWAY',
  },

  'TEST-ICOSAHEDRON-GREEN': {
    ...PREMIUM_SKU_V2,
    code: 'TEST-ICOSAHEDRON-GREEN',
  },

  'TEST-TETRAHEDRON-PURPLE': {
    ...PREMIUM_SKU_V3,
    code: 'TEST-TETRAHEDRON-PURPLE',
  },

  'PREMIUM-V3-WITHOUT-STOCK': { // stock not initialised
    ...PREMIUM_SKU_V3,
    code: 'PREMIUM-V3-WITHOUT-STOCK',
  },

  'PREMIUM-V3-WITH-ZERO-STOCK': { // stock initialised, but set to zero
    ...PREMIUM_SKU_V3,
    code: 'PREMIUM-V3-WITH-ZERO-STOCK',
  },

  'PREMIUM-V3-WITH-STOCK-ERROR': { // throws generic Error when retrieving stock
    ...PREMIUM_SKU_V3,
    code: 'PREMIUM-V3-WITH-STOCK-ERROR',
  },

  'PREMIUM-V3-WITHOUT-PRICE': {
    ...PREMIUM_SKU_V3,
    code: 'PREMIUM-V3-WITHOUT-PRICE',
    recommendedRetailPrice: null,
    permissions: ['METAPLEX_MINT'],
  },

  'PREMIUM-V3-WITHOUT-ENUMERATION': {
    ...PREMIUM_SKU_V3,
    code: 'PREMIUM-V3-WITHOUT-ENUMERATION',
    maxQty: null,
  },

  'PREMIUM-V3-WITHOUT-MINT': {
    ...PREMIUM_SKU_V3,
    code: 'PREMIUM-V3-WITHOUT-MINT',
    permissions: [],
  },
};
