import { ItemEntity } from '../src/entity/item.entity';

const SALE_ENTITY_V1: ItemEntity = {
  "stockKeepingUnitCode": "TEST-ICOSAHEDRON-GREEN",
  "brandCode": "TEST",
  "brandName": "TEST",
  "brandWholesalePrice": 1000,
  "brandWholesalerShare": 0.5,
  "card": null,
  "description": "The only regular solid which tessellates Euclidean space: the hexahedron.  The ancients believed this caused the solidity of the Earth.",
  "maxQty": 10000,
  "media": null,
  "stockKeepingUnitName": "Epic Cube",
  "platformCode": "SKN",
  "stockKeepingUnitRarity": 0,
  "recommendedRetailPrice": 1000,
  "skn": "DYNAMIC",
  "created": new Date("2023-01-31T10:35:34.796Z"),
  "tier": null,
  "user": "cyP1XYi0y6NadKRXqMbmF9R1vz53",
  "updated": new Date("2023-01-31T10:35:34.796Z"),
  "state": "UNBOXED",
  "ownerAddress": null,
  "claimCode": null,
  "key": "f8d4de3db6",
  "nftAddress": null,
  "nftState": "UNMINTED",
  "source": "SALE",
  "saleQty": 2,
  "version": "1"
};

const SALE_ENTITY_V2: ItemEntity = {
  "key": "f8d4de3db6",
  "brandCode": "TEST",
  "brandName": "TEST",
  "brandWholesalePrice": 1000,
  "brandWholesalerShare": 0.5,
  "card": "{\"front\":[{\"text\":\"${issue}/${maximum}\",\"color\":\"#FFFFFFFF\",\"size\":\"36pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1220}],\"back\":[{\"text\":\"${issue}/${maximum}\",\"color\":\"#FFFFFFFF\",\"size\":\"36pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1205},{\"text\":\"${token}\",\"color\":\"#FFFFFFAA\",\"size\":\"30pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1260}]}",
  "claimCode": null,
  "created": new Date("2023-01-31T10:35:34.796Z"),
  "description": "The water element. Twenty triangles in a polyhedral soup. In nature, the icosahedron can be seen in the folded structures of bacteriophages and viruses.\n",
  "maxQty": 10000,
  "media": null,
  "nftAddress": null,
  "nftState": "UNMINTED",
  "ownerAddress": null,
  "platformCode": "SKN",
  "recommendedRetailPrice": 1000,
  "saleQty": 2,
  "skn": "DYNAMIC",
  "source": "SALE",
  "state": "UNBOXED",
  "stockKeepingUnitCode": "TEST-ICOSAHEDRON-GREEN",
  "stockKeepingUnitName": "Green Icosahedron",
  "stockKeepingUnitRarity": null,
  "tier": "GREEN",
  "updated": new Date("2023-01-31T10:35:34.796Z"),
  "user": "cyP1XYi0y6NadKRXqMbmF9R1vz53",
  "version": "2"
};

const MINTED_ENTITY_V2: ItemEntity = {
  ...SALE_ENTITY_V2,
  key: '309a6b3543',
  user: null,
  nftState: 'MINTED',
  nftAddress: 'SOL.devnet.12345',
  ownerAddress: 'SOL.devnet.67890',
};

const SALE_ENTITY_V3: ItemEntity = {
  "key": "26459e2001",
  "brandCode": "TEST",
  "brandName": "TEST",
  "brandWholesalePrice": 10000,
  "brandWholesalerShare": 0.5, "card": null,
  "claimCode": null,
  "created": new Date("2023-01-31T11:42:40.057Z"),
  "description": "The fire element. Simplest of all polyhedra, strongest of all pyramids, the tetrahedron has only four prickly vertices.",
  "maxQty": 2500,
  "media": "{\"primary\":{\"type\":\"VIDEO\"},\"secondary\":[{\"type\":\"VIDEO\",\"link\":\"https://sknups.com\"},{\"type\":\"STATIC\",\"link\":\"https://sknups.com\"},{\"type\":\"DYNAMIC\",\"labels\":[{\"text\":\"${token}\",\"color\":\"#FFFFFFAA\",\"size\":\"30pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1220}],\"link\":\"https://sknups.com\"}]}",
  "nftAddress": null,
  "nftState": "UNMINTED",
  "ownerAddress": null,
  "platformCode": "SKN",
  "recommendedRetailPrice": 10000,
  "saleQty": 2,
  "skn": null,
  "source": "SALE",
  "state": "UNBOXED",
  "stockKeepingUnitCode": "TEST-TETRAHEDRON-PURPLE",
  "stockKeepingUnitName": "Purple Tetrahedron",
  "stockKeepingUnitRarity": null,
  "tier": "PURPLE",
  "updated": new Date("2023-01-31T11:42:40.058Z"),
  "user": "cyP1XYi0y6NadKRXqMbmF9R1vz53",
  "version": "3"
};

export const GIVEAWAY_ENTITY_V2: ItemEntity = {
  "key": "fc07c88901",
  "brandCode": "TEST",
  "brandName": "TEST",
  "brandWholesalePrice": null,
  "brandWholesalerShare": 0.5,
  "card": "{\"back\":[{\"text\":\"${token}\",\"color\":\"#FFFFFFAA\",\"size\":\"30pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1220}]}",
  "claimCode": "octahedron",
  "created": new Date("2023-01-31T09:41:50.936Z"),
  "description": "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
  "maxQty": null,
  "media": null,
  "nftAddress": null,
  "nftState": "UNMINTED",
  "ownerAddress": null,
  "platformCode": "SKN",
  "recommendedRetailPrice": null,
  "saleQty": null,
  "skn": "DYNAMIC",
  "source": "GIVEAWAY",
  "state": "UNBOXED",
  "stockKeepingUnitCode": "TEST-OCTAHEDRON-GIVEAWAY",
  "stockKeepingUnitName": "Giveaway Octahedron",
  "stockKeepingUnitRarity": null,
  "tier": "GIVEAWAY",
  "updated": new Date("2023-01-31T09:41:50.936Z"),
  "user": "cyP1XYi0y6NadKRXqMbmF9R1vz53",
  "version": "2"
};

export const GIVEAWAY_ENTITY_V3: ItemEntity = {
  "key": "ecd5aa6b03",
  "brandCode": "TEST",
  "brandName": "TEST",
  "brandWholesalePrice": null,
  "brandWholesalerShare": 0.5, "card": null,
  "claimCode": "tetrahedron",
  "created": new Date("2023-01-31T09:40:43.010Z"),
  "description": "The fire element. Simplest of all polyhedra, strongest of all pyramids, the tetrahedron has only four prickly vertices.",
  "maxQty": null,
  "media": "{\"primary\":{\"type\":\"STATIC\"},\"secondary\":[{\"type\":\"DYNAMIC\",\"labels\":[{\"text\":\"${token}\",\"color\":\"#FFFFFFAA\",\"size\":\"30pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1220}]}]}",
  "nftAddress": null,
  "nftState": "UNMINTED",
  "ownerAddress": null,
  "platformCode": "SKN",
  "recommendedRetailPrice": null,
  "saleQty": null,
  "skn": null,
  "source": "GIVEAWAY",
  "state": "UNBOXED",
  "stockKeepingUnitCode": "TEST-TETRAHEDRON-GIVEAWAY",
  "stockKeepingUnitName": "Giveaway Tetrahedron",
  "stockKeepingUnitRarity": null,
  "tier": "GIVEAWAY",
  "updated": new Date("2023-01-31T09:40:43.010Z"),
  "user": "cyP1XYi0y6NadKRXqMbmF9R1vz53",
  "version": "3"
};

export const TEST_ENTITIES = {
  v1: {
    sale: SALE_ENTITY_V1
  },
  v2: {
    sale: SALE_ENTITY_V2,
    minted: MINTED_ENTITY_V2,
    giveaway: GIVEAWAY_ENTITY_V2,
  },
  v3: {
    sale: SALE_ENTITY_V3,
    giveaway: GIVEAWAY_ENTITY_V3,
  },
}
