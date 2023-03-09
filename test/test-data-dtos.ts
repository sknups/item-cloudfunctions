import { InternalItemDto } from '../src/dto/internal/item-internal.dto';
import { InternalItemMediaTypeDto } from '../src/dto/internal/item-media-internal.dto';
import { ItemNftState, ItemSource } from '../src/dto/item.dto';
import { RetailerItemMediaTypeDto } from '../src/dto/retailer/item-media-retailer.dto';
import { RetailerItemDto } from '../src/dto/retailer/item-retailer.dto';

const SALE_DTO_V1_INTERNAL: InternalItemDto = {
  "brand": "TEST",
  "cardJson": null,
  "created": "2023-01-31T10:35:34.796Z",
  "description": "The only regular solid which tessellates Euclidean space: the hexahedron.  The ancients believed this caused the solidity of the Earth.",
  "giveaway": null,
  "issue": 2,
  "maximum": 10000,
  "media": null,
  "name": "Epic Cube",
  "nftAddress": null,
  "nftState": ItemNftState.UNMINTED,
  "ownerAddress": null,
  "platform": "SKN",
  "rarity": 0,
  "rrp": 1000,
  "sku": "TEST-ICOSAHEDRON-GREEN",
  "source": ItemSource.SALE,
  "tier": null,
  "token": "f8d4de3db6",
  "version": "1"
};

const SALE_DTO_V1_RETAILER: RetailerItemDto = {
  "brand": "TEST",
  "created": "2023-01-31T10:35:34.796Z",
  "description": "The only regular solid which tessellates Euclidean space: the hexahedron.  The ancients believed this caused the solidity of the Earth.",
  "giveaway": null,
  "issue": null,
  "maximum": null,
  "name": "Epic Cube",
  "nftState": ItemNftState.UNMINTED,
  "platform": "SKN",
  "sku": "TEST-ICOSAHEDRON-GREEN",
  "source": ItemSource.SALE,
  "tier": null,
  "token": "f8d4de3db6",
  "version": "1",
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
};

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

const SALE_DTO_V2_RETAILER: RetailerItemDto = {
  "brand": "TEST",
  "created": "2023-01-31T10:35:34.796Z",
  "description": "The water element. Twenty triangles in a polyhedral soup. In nature, the icosahedron can be seen in the folded structures of bacteriophages and viruses.\n",
  "giveaway": null,
  "issue": 2,
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
  "sku": "TEST-ICOSAHEDRON-GREEN",
  "source": ItemSource.SALE,
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

const GIVEAWAY_DTO_V2_RETAILER: RetailerItemDto = {
  "brand": "TEST",
  "created": "2023-01-31T09:41:50.936Z",
  "description": "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
  "giveaway": "octahedron",
  "issue": null,
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
  "sku": "TEST-OCTAHEDRON-GIVEAWAY",
  "source": ItemSource.GIVEAWAY,
  "tier": "GIVEAWAY",
  "token": "fc07c88901",
  "version": "2"
};

const SALE_DTO_V3_INTERNAL: InternalItemDto = {
  "brand": "TEST",
  "cardJson": null,
  "created": "2023-01-31T11:42:40.057Z",
  "description": "The fire element. Simplest of all polyhedra, strongest of all pyramids, the tetrahedron has only four prickly vertices.",
  "giveaway": null,
  "issue": 2,
  "maximum": 2500,
  "media": {
    "primary": {
      "type": InternalItemMediaTypeDto.VIDEO
    },
    "secondary": [
      {
        "link": "https://sknups.com",
        "type": InternalItemMediaTypeDto.VIDEO
      },
      {
        "link": "https://sknups.com",
        "type": InternalItemMediaTypeDto.STATIC
      },
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
        "link": "https://sknups.com",
        "type": InternalItemMediaTypeDto.DYNAMIC
      }
    ]
  },
  "name": "Purple Tetrahedron",
  "nftAddress": null,
  "nftState": ItemNftState.UNMINTED,
  "ownerAddress": null,
  "platform": "SKN",
  "rarity": null,
  "rrp": 10000,
  "sku": "TEST-TETRAHEDRON-PURPLE",
  "source": ItemSource.SALE,
  "tier": "PURPLE",
  "token": "26459e2001",
  "version": "3"
}

const SALE_DTO_V3_RETAILER: RetailerItemDto = {
  "brand": "TEST",
  "created": "2023-01-31T11:42:40.057Z",
  "description": "The fire element. Simplest of all polyhedra, strongest of all pyramids, the tetrahedron has only four prickly vertices.",
  "giveaway": null,
  "issue": null,
  "maximum": null,
  "media": {
    "model": {
      "config": "https://assets-dev.sknups.gg/sku.v1.3DConfig.TEST-TETRAHEDRON-PURPLE.json",
      "glb": "https://assets-dev.sknups.gg/sku.v1.3DView.TEST-TETRAHEDRON-PURPLE.glb"
    },
    "primary": {
      "image": {
        "jpeg": "https://assets-dev.sknups.gg/sku.TEST-TETRAHEDRON-PURPLE.primary.jpg",
        "png": "https://assets-dev.sknups.gg/sku.TEST-TETRAHEDRON-PURPLE.primary.png",
        "webp": "https://assets-dev.sknups.gg/sku.TEST-TETRAHEDRON-PURPLE.primary.webp"
      },
      "type": RetailerItemMediaTypeDto.VIDEO,
      "video": {
        "mp4": "https://assets-dev.sknups.gg/sku.TEST-TETRAHEDRON-PURPLE.primary.mp4"
      }
    },
    "secondary": [
      {
        "image": {
          "jpeg": "https://assets-dev.sknups.gg/sku.TEST-TETRAHEDRON-PURPLE.secondary.0.jpg",
          "png": "https://assets-dev.sknups.gg/sku.TEST-TETRAHEDRON-PURPLE.secondary.0.png",
          "webp": "https://assets-dev.sknups.gg/sku.TEST-TETRAHEDRON-PURPLE.secondary.0.webp"
        },
        "link": "https://sknups.com",
        "type": RetailerItemMediaTypeDto.VIDEO,
        "video": {
          "mp4": "https://assets-dev.sknups.gg/sku.TEST-TETRAHEDRON-PURPLE.secondary.0.mp4"
        }
      },
      {
        "image": {
          "jpeg": "https://assets-dev.sknups.gg/sku.TEST-TETRAHEDRON-PURPLE.secondary.1.jpg",
          "png": "https://assets-dev.sknups.gg/sku.TEST-TETRAHEDRON-PURPLE.secondary.1.png",
          "webp": "https://assets-dev.sknups.gg/sku.TEST-TETRAHEDRON-PURPLE.secondary.1.webp"
        },
        "link": "https://sknups.com",
        "type": RetailerItemMediaTypeDto.IMAGE
      },
      {
        "image": {
          "jpeg": "https://flex-dev.sknups.com/skn/v1/secondary/2/default/26459e2001.jpg",
          "png": "https://flex-dev.sknups.com/skn/v1/secondary/2/default/26459e2001.png",
          "webp": "https://flex-dev.sknups.com/skn/v1/secondary/2/default/26459e2001.webp"
        },
        "link": "https://sknups.com",
        "type": RetailerItemMediaTypeDto.IMAGE
      }
    ],
    "social": {
      "default": {
        "image": {
          "jpeg": "https://flex-dev.sknups.com/skn/v1/primary/og/26459e2001.jpg",
          "png": "https://flex-dev.sknups.com/skn/v1/primary/og/26459e2001.png",
          "webp": "https://flex-dev.sknups.com/skn/v1/primary/og/26459e2001.webp"
        }
      },
      "snapchat": {
        "image": {
          "jpeg": "https://flex-dev.sknups.com/skn/v1/primary/snapsticker/26459e2001.jpg",
          "png": "https://flex-dev.sknups.com/skn/v1/primary/snapsticker/26459e2001.png",
          "webp": "https://flex-dev.sknups.com/skn/v1/primary/snapsticker/26459e2001.webp"
        }
      }
    }
  },
  "name": "Purple Tetrahedron",
  "nftState": ItemNftState.UNMINTED,
  "platform": "SKN",
  "sku": "TEST-TETRAHEDRON-PURPLE",
  "source": ItemSource.SALE,
  "tier": "PURPLE",
  "token": "26459e2001",
  "version": "3"
};

export const TEST_DTOS = {
  v1: {
    sale: {
      internal: SALE_DTO_V1_INTERNAL,
      retailer: SALE_DTO_V1_RETAILER,
    },
  },
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
    sale: {
      internal: SALE_DTO_V3_INTERNAL,
      retailer: SALE_DTO_V3_RETAILER,
    },
  },
};
