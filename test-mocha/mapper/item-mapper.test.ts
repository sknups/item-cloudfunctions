import { expect } from 'chai';
import { ItemDTOMapper } from "../../src/mapper/item-mapper";
import { ItemEntityData } from '../../src/persistence/item-entity';

describe('mapper - item', () => {

    const instance = new ItemDTOMapper(
        "https://assets.example.com",
        "https://flex-dev.sknups.gg",
        "https://app-dev.sknups.gg",
        );

    it('creates item dto structure', () => {
        expect(instance.toDTO(new ItemEntityData(
            "338a6b3128",                        
            14,
            10000,
            "Common Octahedron",
            "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
            "emailHash",
            "user123",
            "TEST",
            "SKN",
            "TEST-OCTAHEDRON-COMMON",
            "SALE",
            "test123",
            "PREMIUM",
            100,
            "UNMINTED",
            1657622239335000,
            1,
            '{"back": {"token": {"color": "#FFFFFFFF","font-size": "25pt","font-family": "ShareTechMono-Regular","font-weight": "Regular","x": 470,"y": 340}}}',
            "1",
            "STATIC",
        ))).eql({
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
    })

    it('generates \'VIDEO\' media structure', () => {
        expect(instance.toDTO(new ItemEntityData(
            "338a6b3128",
            14,
            10000,
            "Common Octahedron",
            "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
            "emailHash",
            "user123",
            "TEST",
            "SKN",
            "TEST-OCTAHEDRON-COMMON",
            "SALE",
            "test123",
            "PREMIUM",
            100,
            "UNMINTED",
            1657622239335000,
            1,
            '{"back": {"token": {"color": "#FFFFFFFF","font-size": "25pt","font-family": "ShareTechMono-Regular","font-weight": "Regular","x": 470,"y": 340}}}',
            "1",
            "VIDEO",
        ))).eql({
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
    })

    it('throws error if skn is not \'STATIC\' or \'VIDEO\'', () => {
        expect(() => {
            instance.toDTO(new ItemEntityData(
                "338a6b3128",
                14,
                10000,
                "Common Octahedron",
                "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
                "emailHash",
                "user123",
                "TEST",
                "SKN",
                "TEST-OCTAHEDRON-COMMON",
                "SALE",
                "test123",
                "PREMIUM",
                100,
                "UNMINTED",
                1657622239335000,
                1,
                '{"back": {"token": {"color": "#FFFFFFFF","font-size": "25pt","font-family": "ShareTechMono-Regular","font-weight": "Regular","x": 470,"y": 340}}}',
                "1",
                "INVALID",
            ))
        }).to.throw("unsupported skn value 'INVALID'. Must be 'STATIC' or 'VIDEO'")
    })


})