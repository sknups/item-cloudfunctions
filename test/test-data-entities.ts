import { ItemEntity, ProjectedItemEntity } from '../src/entity/item.entity';

const SALE_ENTITY_V2_PROJECTED: ProjectedItemEntity = {
  "key": "f8d4de3db6",
  "brandCode": "TEST",
  "card": "{\"front\":[{\"text\":\"${issue}/${maximum}\",\"color\":\"#FFFFFFFF\",\"size\":\"36pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1220}],\"back\":[{\"text\":\"${issue}/${maximum}\",\"color\":\"#FFFFFFFF\",\"size\":\"36pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1205},{\"text\":\"${token}\",\"color\":\"#FFFFFFAA\",\"size\":\"30pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1260}]}",
  "claimCode": null,
  "created": new Date("2023-01-31T10:35:34.796Z"),
  "description": "The water element. Twenty triangles in a polyhedral soup. In nature, the icosahedron can be seen in the folded structures of bacteriophages and viruses.\n",
  "emailHash": "8b246c38d16a2432ef1b9e3b79279b65d0ba514ad648e99d741d695c66c02fab",
  "maxQty": 10000,
  "media": null,
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
  "user": "cyP1XYi0y6NadKRXqMbmF9R1vz53",
  "version": "2"
};

const SALE_ENTITY_V2: ItemEntity = {
  ...SALE_ENTITY_V2_PROJECTED,
  "brandName": "TEST",
  "brandWholesalePrice": 1000,
  "brandWholesalerShare": 0.5,
  "nftAddress": null,
  "updated": new Date("2023-01-31T10:35:34.796Z"),
};

const MINTED_ENTITY_V2_PROJECTED: ProjectedItemEntity = {
  ...SALE_ENTITY_V2_PROJECTED,
  key: '309a6b3543',
};

const MINTED_ENTITY_V2: ItemEntity = {
  ...SALE_ENTITY_V2,
  emailHash: null,
  user: null,
  nftState: 'MINTED',
  nftAddress: 'SOL.devnet.12345',
  ownerAddress: 'SOL.devnet.67890',
};

const SALE_ENTITY_V3_PROJECTED: ProjectedItemEntity = {
  "key": "26459e2001",
  "brandCode": "TEST",
  "card": null,
  "claimCode": null,
  "created": new Date("2023-01-31T11:42:40.057Z"),
  "description": "The fire element. Simplest of all polyhedra, strongest of all pyramids, the tetrahedron has only four prickly vertices.",
  "emailHash": "8b246c38d16a2432ef1b9e3b79279b65d0ba514ad648e99d741d695c66c02fab",
  "maxQty": 2500,
  "media": "{\"primary\":{\"type\":\"VIDEO\"},\"secondary\":[{\"type\":\"VIDEO\",\"link\":\"https://sknups.com\"},{\"type\":\"STATIC\",\"link\":\"https://sknups.com\"},{\"type\":\"DYNAMIC\",\"labels\":[{\"text\":\"${token}\",\"color\":\"#FFFFFFAA\",\"size\":\"30pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1220}],\"link\":\"https://sknups.com\"}]}",
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
  "user": "cyP1XYi0y6NadKRXqMbmF9R1vz53",
  "version": "3"
};

const SALE_ENTITY_V3: ItemEntity = {
  ...SALE_ENTITY_V3_PROJECTED,
  "brandName": "TEST",
  "brandWholesalePrice": 10000,
  "brandWholesalerShare": 0.5,
  "nftAddress": null,
  "updated": new Date("2023-01-31T11:42:40.058Z"),
};

export const GIVEAWAY_ENTITY_V2_PROJECTED: ProjectedItemEntity = {
  "key": "fc07c88901",
  "brandCode": "TEST",
  "card": "{\"back\":[{\"text\":\"${token}\",\"color\":\"#FFFFFFAA\",\"size\":\"30pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1220}]}",
  "claimCode": "octahedron",
  "created": new Date("2023-01-31T09:41:50.936Z"),
  "description": "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
  "emailHash": "8b246c38d16a2432ef1b9e3b79279b65d0ba514ad648e99d741d695c66c02fab",
  "maxQty": null,
  "media": null,
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
  "user": "cyP1XYi0y6NadKRXqMbmF9R1vz53",
  "version": "2"
};

const GIVEAWAY_ENTITY_V2: ItemEntity = {
  ...GIVEAWAY_ENTITY_V2_PROJECTED,
  "brandName": "TEST",
  "brandWholesalePrice": null,
  "brandWholesalerShare": 0.5,
  "nftAddress": null,
  "updated": new Date("2023-01-31T09:41:50.936Z"),
};

export const GIVEAWAY_ENTITY_V3_PROJECTED: ProjectedItemEntity = {
  "key": "ecd5aa6b03",
  "brandCode": "TEST",
  "card": null,
  "claimCode": "tetrahedron",
  "created": new Date("2023-01-31T09:40:43.010Z"),
  "description": "The fire element. Simplest of all polyhedra, strongest of all pyramids, the tetrahedron has only four prickly vertices.",
  "emailHash": "8b246c38d16a2432ef1b9e3b79279b65d0ba514ad648e99d741d695c66c02fab",
  "maxQty": null,
  "media": "{\"primary\":{\"type\":\"STATIC\"},\"secondary\":[{\"type\":\"DYNAMIC\",\"labels\":[{\"text\":\"${token}\",\"color\":\"#FFFFFFAA\",\"size\":\"30pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1220}]}]}",
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
  "user": "cyP1XYi0y6NadKRXqMbmF9R1vz53",
  "version": "3"
};

const GIVEAWAY_ENTITY_V3: ItemEntity = {
  ...GIVEAWAY_ENTITY_V3_PROJECTED,
  "brandName": "TEST",
  "brandWholesalePrice": null,
  "brandWholesalerShare": 0.5,
  "nftAddress": null,
  "updated": new Date("2023-01-31T09:40:43.010Z"),
};

export const TEST_ENTITIES = {
  v2: {
    sale: {
      projected: SALE_ENTITY_V2_PROJECTED,
      full: SALE_ENTITY_V2,
    },
    minted: {
      projected: MINTED_ENTITY_V2_PROJECTED,
      full: MINTED_ENTITY_V2,
    },
    giveaway: {
      projected: GIVEAWAY_ENTITY_V2_PROJECTED,
      full: GIVEAWAY_ENTITY_V2,
    },
  },
  v3: {
    sale: {
      projected: SALE_ENTITY_V3_PROJECTED,
      full: SALE_ENTITY_V3,
    },
    giveaway: {
      projected: GIVEAWAY_ENTITY_V3_PROJECTED,
      full: GIVEAWAY_ENTITY_V3,
    },
  },
}
