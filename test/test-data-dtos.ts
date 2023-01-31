import { InternalItemDto } from '../src/dto/internal/item-internal.dto';
import { InternalItemMediaTypeDto } from '../src/dto/internal/item-media-internal.dto';
import { ItemNftState, ItemSource } from '../src/dto/item.dto';
import { RetailerItemMediaTypeDto } from '../src/dto/retailer/item-media-retailer.dto';
import { LegacyRetailerItemDto } from '../src/dto/retailer/item-retailer.dto';

const SALE_DTO_V2_INTERNAL: InternalItemDto = {
  "brand": "TEST",
  "cardJson": "{\"front\":[{\"text\":\"${issue}/${maximum}\",\"color\":\"#FFFFFFFF\",\"size\":\"36pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1220}],\"back\":[{\"text\":\"${issue}/${maximum}\",\"color\":\"#FFFFFFFF\",\"size\":\"36pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1205},{\"text\":\"${token}\",\"color\":\"#FFFFFFAA\",\"size\":\"30pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1260}]}",
  "created": "2023-01-31T10:35:34.796Z",
  "description": "The water element. Twenty triangles in a polyhedral soup. In nature, the icosahedron can be seen in the folded structures of bacteriophages and viruses.\n",
  "giveaway": null,
  "issue": 2,
  "maximum": 10000,
  "media": {
    "primary": {
      "labels": [
        {
          "align": "center",
          "color": "#FFFFFFFF",
          "font": "Share Tech Mono",
          "size": "36pt",
          "text": "${issue}/${maximum}",
          "weight": "Regular",
          "x": 450,
          "y": 1220
        }
      ],
      "type": InternalItemMediaTypeDto.DYNAMIC
    },
    "secondary": [
      {
        "labels": [
          {
            "align": "center",
            "color": "#FFFFFFFF",
            "font": "Share Tech Mono",
            "size": "36pt",
            "text": "${issue}/${maximum}",
            "weight": "Regular",
            "x": 450,
            "y": 1205
          },
          {
            "align": "center",
            "color": "#FFFFFFAA",
            "font": "Share Tech Mono",
            "size": "30pt",
            "text": "${token}",
            "weight": "Regular",
            "x": 450,
            "y": 1260
          }
        ],
        "type": InternalItemMediaTypeDto.DYNAMIC
      }
    ]
  },
  "name": "Green Icosahedron",
  "nftAddress": null,
  "nftState": ItemNftState.UNMINTED,
  "ownerAddress": null,
  "platform": "SKN",
  "rarity": null,
  "rrp": 1000,
  "sku": "TEST-ICOSAHEDRON-GREEN",
  "source": ItemSource.SALE,
  "tier": "GREEN",
  "token": "f8d4de3db6",
  "version": "2"
};

const SALE_DTO_V2_RETAILER: LegacyRetailerItemDto = {
  "brand": "TEST",
  "brandCode": "TEST",
  "certVersion": "v1",
  "claimCode": null,
  "created": "2023-01-31T10:35:34.796Z",
  "description": "The water element. Twenty triangles in a polyhedral soup. In nature, the icosahedron can be seen in the folded structures of bacteriophages and viruses.\n",
  "flexHost": "https://flex-dev.sknups.com",
  "giveaway": null,
  "issue": 2,
  "maxQty": 10000,
  "maximum": 10000,
  "media": {
    "model": {
      "config": "https://assets-dev.sknups.gg/sku.v1.3DConfig.TEST-ICOSAHEDRON-GREEN.json",
      "glb": "https://assets-dev.sknups.gg/sku.v1.3DView.TEST-ICOSAHEDRON-GREEN.glb"
    },
    "primary": {
      "image": {
        "jpeg": "https://flex-dev.sknups.com/skn/v1/primary/default/f8d4de3db6.jpg",
        "png": "https://flex-dev.sknups.com/skn/v1/primary/default/f8d4de3db6.png",
        "webp": "https://flex-dev.sknups.com/skn/v1/primary/default/f8d4de3db6.webp"
      },
      "type": RetailerItemMediaTypeDto.IMAGE
    },
    "secondary": [
      {
        "image": {
          "jpeg": "https://flex-dev.sknups.com/skn/v1/secondary/0/default/f8d4de3db6.jpg",
          "png": "https://flex-dev.sknups.com/skn/v1/secondary/0/default/f8d4de3db6.png",
          "webp": "https://flex-dev.sknups.com/skn/v1/secondary/0/default/f8d4de3db6.webp"
        },
        "type": RetailerItemMediaTypeDto.IMAGE
      }
    ],
    "social": {
      "default": {
        "image": {
          "jpeg": "https://flex-dev.sknups.com/skn/v1/primary/og/f8d4de3db6.jpg",
          "png": "https://flex-dev.sknups.com/skn/v1/primary/og/f8d4de3db6.png",
          "webp": "https://flex-dev.sknups.com/skn/v1/primary/og/f8d4de3db6.webp"
        }
      },
      "snapchat": {
        "image": {
          "jpeg": "https://flex-dev.sknups.com/skn/v1/primary/snapsticker/f8d4de3db6.jpg",
          "png": "https://flex-dev.sknups.com/skn/v1/primary/snapsticker/f8d4de3db6.png",
          "webp": "https://flex-dev.sknups.com/skn/v1/primary/snapsticker/f8d4de3db6.webp"
        }
      }
    }
  },
  "name": "Green Icosahedron",
  "nftState": ItemNftState.UNMINTED,
  "platform": "SKN",
  "platformCode": "SKN",
  "rarity": null,
  "recommendedRetailPrice": 1000,
  "rrp": 1000,
  "saleQty": 2,
  "sknappHost": "https://app-dev.sknups.com",
  "sku": "TEST-ICOSAHEDRON-GREEN",
  "source": ItemSource.SALE,
  "stockKeepingUnitCode": "TEST-ICOSAHEDRON-GREEN",
  "thumbprint": "f8d4de3db6",
  "tier": "GREEN",
  "token": "f8d4de3db6",
  "version": "2"
};

const GIVEAWAY_DTO_V2_INTERNAL: InternalItemDto = {
  "brand": "TEST",
  "cardJson": "{\"back\":[{\"text\":\"${token}\",\"color\":\"#FFFFFFAA\",\"size\":\"30pt\",\"font\":\"Share Tech Mono\",\"weight\":\"Regular\",\"align\":\"center\",\"x\":450,\"y\":1220}]}",
  "created": "2023-01-31T09:41:50.936Z",
  "description": "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
  "giveaway": "octahedron",
  "issue": null,
  "maximum": null,
  "media": {
    "primary": {
      "labels": [],
      "type": InternalItemMediaTypeDto.DYNAMIC
    },
    "secondary": [
      {
        "labels": [
          {
            "align": "center",
            "color": "#FFFFFFAA",
            "font": "Share Tech Mono",
            "size": "30pt",
            "text": "${token}",
            "weight": "Regular",
            "x": 450,
            "y": 1220
          }
        ],
        "type": InternalItemMediaTypeDto.DYNAMIC
      }
    ]
  },
  "name": "Giveaway Octahedron",
  "nftAddress": null,
  "nftState": ItemNftState.UNMINTED,
  "ownerAddress": null,
  "platform": "SKN",
  "rarity": null,
  "rrp": null,
  "sku": "TEST-OCTAHEDRON-GIVEAWAY",
  "source": ItemSource.GIVEAWAY,
  "tier": "GIVEAWAY",
  "token": "fc07c88901",
  "version": "2"
};

const GIVEAWAY_DTO_V2_RETAILER: LegacyRetailerItemDto = {
  "brand": "TEST",
  "brandCode": "TEST",
  "certVersion": "v1",
  "claimCode": "octahedron",
  "created": "2023-01-31T09:41:50.936Z",
  "description": "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
  "flexHost": "https://flex-dev.sknups.com",
  "giveaway": "octahedron",
  "issue": null,
  "maxQty": null,
  "maximum": null,
  "media": {
    "model": {
      "config": "https://assets-dev.sknups.gg/sku.v1.3DConfig.TEST-OCTAHEDRON-GIVEAWAY.json",
      "glb": "https://assets-dev.sknups.gg/sku.v1.3DView.TEST-OCTAHEDRON-GIVEAWAY.glb"
    },
    "primary": {
      "image": {
        "jpeg": "https://flex-dev.sknups.com/skn/v1/primary/default/fc07c88901.jpg",
        "png": "https://flex-dev.sknups.com/skn/v1/primary/default/fc07c88901.png",
        "webp": "https://flex-dev.sknups.com/skn/v1/primary/default/fc07c88901.webp"
      },
      "type": RetailerItemMediaTypeDto.IMAGE
    },
    "secondary": [
      {
        "image": {
          "jpeg": "https://flex-dev.sknups.com/skn/v1/secondary/0/default/fc07c88901.jpg",
          "png": "https://flex-dev.sknups.com/skn/v1/secondary/0/default/fc07c88901.png",
          "webp": "https://flex-dev.sknups.com/skn/v1/secondary/0/default/fc07c88901.webp"
        },
        "type": RetailerItemMediaTypeDto.IMAGE
      }
    ],
    "social": {
      "default": {
        "image": {
          "jpeg": "https://flex-dev.sknups.com/skn/v1/primary/og/fc07c88901.jpg",
          "png": "https://flex-dev.sknups.com/skn/v1/primary/og/fc07c88901.png",
          "webp": "https://flex-dev.sknups.com/skn/v1/primary/og/fc07c88901.webp"
        }
      },
      "snapchat": {
        "image": {
          "jpeg": "https://flex-dev.sknups.com/skn/v1/primary/snapsticker/fc07c88901.jpg",
          "png": "https://flex-dev.sknups.com/skn/v1/primary/snapsticker/fc07c88901.png",
          "webp": "https://flex-dev.sknups.com/skn/v1/primary/snapsticker/fc07c88901.webp"
        }
      }
    }
  },
  "name": "Giveaway Octahedron",
  "nftState": ItemNftState.UNMINTED,
  "platform": "SKN",
  "platformCode": "SKN",
  "rarity": null,
  "recommendedRetailPrice": null,
  "rrp": null,
  "saleQty": null,
  "sknappHost": "https://app-dev.sknups.com",
  "sku": "TEST-OCTAHEDRON-GIVEAWAY",
  "source": ItemSource.GIVEAWAY,
  "stockKeepingUnitCode": "TEST-OCTAHEDRON-GIVEAWAY",
  "thumbprint": "fc07c88901",
  "tier": "GIVEAWAY",
  "token": "fc07c88901",
  "version": "2"
};

export const TEST_DTOS = {
  v2: {
    sale: {
      internal: SALE_DTO_V2_INTERNAL,
      retailer: SALE_DTO_V2_RETAILER,
    },
    giveaway: {
      internal: GIVEAWAY_DTO_V2_INTERNAL,
      retailer: GIVEAWAY_DTO_V2_RETAILER,
    },
  },
  v3: {

  },
};
