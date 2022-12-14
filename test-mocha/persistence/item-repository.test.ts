import * as sinon from 'sinon';
import { expect } from 'chai';
import { ItemRepository } from "../../src/persistence/item-repository";
import { Datastore } from '@google-cloud/datastore';
import { ItemEntityData } from '../../src/persistence/item-entity';

describe('persistence - byEmailHash', () => {

    let instance: ItemRepository;

    beforeEach(function () {
        instance = new ItemRepository();
    });

    afterEach(function () {
        sinon.restore();
    });

    it('uses correct query', () => {
        const fakeRunQuery = sinon.fake();
        sinon.replace(ItemRepository.datastore, "runQuery", fakeRunQuery);

        const platform = 'TEST';
        const emailHash = '495a8c7b1ab6fd611377ba81fe75cdead63f0ebe88a9260806a3fba790400805';


        const expectedQuery = {
            namespace: 'drm',
            kinds: ['item'],
            selectVal: [
                'brandCode',
                'card',
                'claimCode',
                'created',
                'description',
                'maxQty',
                'nftState',
                'ownerAddress',
                'recommendedRetailPrice',
                'saleQty',
                'skn',
                'source',
                'stockKeepingUnitCode',
                'stockKeepingUnitName',
                'stockKeepingUnitRarity',
                'tier',
                'user',
                'version'
            ],
            filters: [
                { name: 'platformCode', op: '=', val: platform },
                { name: 'emailHash', op: '=', val: emailHash },
                { name: 'state', op: '!=', val: 'DELETED' }
            ]
        }

        instance.byEmailHash(platform, emailHash);
        sinon.assert.calledOnceWithExactly(fakeRunQuery, sinon.match(expectedQuery))
    })

    it('transforms results', async () => {

        const queryResult = [{
            saleQty: 14,
            maxQty: 10000,
            source: "SALE",
            nftState: "UNMINTED",
            claimCode: null,
            stockKeepingUnitName: "Common Octahedron",
            description: "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
            brandCode: "TEST",
            stockKeepingUnitCode: "TEST-OCTAHEDRON-COMMON",
            tier: "GIVEAWAY",
            recommendedRetailPrice: 100,
            user: 'abc123',
            created: 1657622239335000,
            card: null,
            stockKeepingUnitRarity: null,
            version: "1",
            skn: "STATIC"
        },
        {
            saleQty: 8,
            maxQty: 100,
            source: "GIVEAWAY",
            nftState: "UNMINTED",
            claimCode: "claim-123",
            stockKeepingUnitName: "Rare Cube",
            description: "The only regular solid which tessellates Euclidean space: the hexahedron.  The ancients believed this caused the solidity of the Earth.",
            brandCode: "TEST",
            stockKeepingUnitCode: "TEST-CUBE-RARE",
            tier: "GREEN",
            recommendedRetailPrice: 1000,
            user: 'abc123',
            created: 1654013672253000,
            card: null,
            stockKeepingUnitRarity: null,
            version: "1",
            skn: "STATIC"
        }]

        queryResult[0][Datastore.KEY] = {
            name: "338a6b3128"
        }

        queryResult[1][Datastore.KEY] = {
            name: "07e6554733"
        }

        const fakeRunQuery = sinon.fake.resolves([queryResult]);
        sinon.replace(ItemRepository.datastore, "runQuery", fakeRunQuery);

        const platform = 'TEST';
        const emailHash = '495a8c7b1ab6fd611377ba81fe75cdead63f0ebe88a9260806a3fba790400805';

        const results = await instance.byEmailHash(platform, emailHash);

        expect(results).eql([
            new ItemEntityData(
                "338a6b3128",
                14,
                10000,
                "Common Octahedron",
                "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
                "495a8c7b1ab6fd611377ba81fe75cdead63f0ebe88a9260806a3fba790400805",
                "abc123",
                "TEST",
                "TEST",
                "TEST-OCTAHEDRON-COMMON",
                "SALE",
                null,
                "GIVEAWAY",
                100,
                "UNMINTED",
                1657622239335000,
                null,
                null,
                "1",
                "STATIC"
            ),
            new ItemEntityData(
                "07e6554733",      
                8,
                100,
                "Rare Cube",
                "The only regular solid which tessellates Euclidean space: the hexahedron.  The ancients believed this caused the solidity of the Earth.",
                "495a8c7b1ab6fd611377ba81fe75cdead63f0ebe88a9260806a3fba790400805",
                "abc123",
                "TEST",
                "TEST",
                "TEST-CUBE-RARE",
                "GIVEAWAY",
                "claim-123",
                "GREEN",
                1000,
                "UNMINTED",
                1654013672253000,
                null,
                null,
                "1",
                "STATIC"
            )
        ]
        )
    })

})

describe('persistence - byWalletAddress', () => {

    let instance: ItemRepository;

    beforeEach(function () {
        instance = new ItemRepository();
    });

    afterEach(function () {
        sinon.restore();
    });

    it('uses correct query', () => {
        const fakeRunQuery = sinon.fake();
        sinon.replace(ItemRepository.datastore, "runQuery", fakeRunQuery);

        const platform = 'TEST';
        const walletAddress = 'SOL.devnet.9H5c7kkULEmT7MvrJp1MEavN1tu7MN5uG5Yigb54D7Vx';

        const expectedQuery = {
            namespace: 'drm',
            kinds: ['item'],
            selectVal: [
                'brandCode',
                'card',
                'claimCode',
                'created',
                'description',
                'emailHash',
                'maxQty',
                'recommendedRetailPrice',
                'saleQty',
                'skn',
                'source',
                'stockKeepingUnitCode',
                'stockKeepingUnitName',
                'stockKeepingUnitRarity',
                'tier',
                'user',
                'version'
            ],
            filters: [
                { name: 'platformCode', op: '=', val: platform },
                { name: 'ownerAddress', op: '=', val: walletAddress },
                { name: 'nftState', op: '=', val: 'MINTED' },
                { name: 'state', op: '!=', val: 'DELETED'}
            ]
        }

        instance.byWalletAddress(platform, walletAddress);
        sinon.assert.calledOnceWithExactly(fakeRunQuery, sinon.match(expectedQuery))
    })

    it('transforms results', async () => {

        const queryResult = [{
            saleQty: 14,
            maxQty: 10000,
            source: "SALE",
            nftState: "MINTED",
            claimCode: null,
            stockKeepingUnitName: "Common Octahedron",
            description: "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
            brandCode: "TEST",
            stockKeepingUnitCode: "TEST-OCTAHEDRON-COMMON",
            tier: "GIVEAWAY",
            recommendedRetailPrice: 100,
            emailHash: null,
            user: "abc432",
            created: 1657622239335000,
            card: null,
            stockKeepingUnitRarity: null,
            version: "1",
            skn: "STATIC"
        },
        {            
            saleQty: 8,
            maxQty: 100,
            source: "GIVEAWAY",
            nftState: "MINTED",
            claimCode: "claim-123",
            stockKeepingUnitName: "Rare Cube",
            description: "The only regular solid which tessellates Euclidean space: the hexahedron.  The ancients believed this caused the solidity of the Earth.",
            brandCode: "TEST",
            stockKeepingUnitCode: "TEST-CUBE-RARE",
            tier: "GREEN",
            recommendedRetailPrice: 1000,
            emailHash: null,
            user: "abc432",
            created: 1654013672253000,
            card: null,
            stockKeepingUnitRarity: null,
            version: "1",
            skn: "STATIC"
        }]

        queryResult[0][Datastore.KEY] = {
            name: "338a6b3128"
        }

        queryResult[1][Datastore.KEY] = {
            name: "07e6554733"
        }

        const fakeRunQuery = sinon.fake.resolves([queryResult]);
        sinon.replace(ItemRepository.datastore, "runQuery", fakeRunQuery);

        const platform = 'TEST';
        const walletAddress = 'SOL.devnet.9H5c7kkULEmT7MvrJp1MEavN1tu7MN5uG5Yigb54D7Vx';

        const results = await instance.byWalletAddress(platform, walletAddress);
        expect(results).eql([
            new ItemEntityData(
                "338a6b3128",    
                14,
                10000,
                "Common Octahedron",
                "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
                null,
                "abc432",
                "TEST",
                "TEST",
                "TEST-OCTAHEDRON-COMMON",
                "SALE",
                null,
                "GIVEAWAY",
                100,
                "MINTED",
                1657622239335000,
                null,
                null,
                "1",
                "STATIC"
            ),
            new ItemEntityData(
                "07e6554733",            
                8,
                100,
                "Rare Cube",
                "The only regular solid which tessellates Euclidean space: the hexahedron.  The ancients believed this caused the solidity of the Earth.",
                null,
                "abc432",
                "TEST",
                "TEST",
                "TEST-CUBE-RARE",
                "GIVEAWAY",
                "claim-123",
                "GREEN",
                1000,
                "MINTED",
                1654013672253000,
                null,
                null,
                "1",
                "STATIC"
            )
        ]
        )
    })

})

describe('persistence - byUser', () => {

    let instance: ItemRepository;

    const platform = 'TEST';
    const user = 'abc123';


    beforeEach(function () {
        instance = new ItemRepository();
    });

    afterEach(function () {
        sinon.restore();
    });

    it('uses correct query', () => {
        const fakeRunQuery = sinon.fake();
        sinon.replace(ItemRepository.datastore, "runQuery", fakeRunQuery);

        const expectedQuery = {
            namespace: 'drm',
            kinds: ['item'],
            selectVal: [
                'brandCode',
                'card',                
                'claimCode',
                'created',
                'description',
                'emailHash',      
                'maxQty',
                'nftState',
                'ownerAddress',
                'recommendedRetailPrice',
                'saleQty',
                'skn',                
                'source',
                'stockKeepingUnitCode',
                'stockKeepingUnitName',
                'stockKeepingUnitRarity',
                'tier',
                'version'
            ],
            filters: [
                { name: 'platformCode', op: '=', val: platform },
                { name: 'user', op: '=', val: user },
                { name: 'state', op: '!=', val: 'DELETED'}
            ]
        }

        instance.byUser(platform, user);
        sinon.assert.calledOnceWithExactly(fakeRunQuery, sinon.match(expectedQuery))
    })

    it('transforms results', async () => {

        const queryResult = [{
            saleQty: 14,
            maxQty: 10000,
            source: "SALE",
            nftState: "MINTED",
            claimCode: null,
            stockKeepingUnitName: 'Common Octahedron',
            description: "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
            brandCode: "TEST",
            stockKeepingUnitCode: "TEST-OCTAHEDRON-COMMON",
            recommendedRetailPrice: 100,
            emailHash: null,
            tier: "GIVEAWAY",
            user: user,
            created: 1657622239335000,
            card: null,
            stockKeepingUnitRarity: null,
            version: "1",
            skn: "STATIC"
        },
        {
            saleQty: 8,
            maxQty: 100,
            source: "GIVEAWAY",
            nftState: "MINTED",
            claimCode: "claim-123",
            stockKeepingUnitName: 'Rare Cube',
            description: "The only regular solid which tessellates Euclidean space: the hexahedron.  The ancients believed this caused the solidity of the Earth.",
            brandCode: "TEST",
            stockKeepingUnitCode: "TEST-CUBE-RARE",
            recommendedRetailPrice: 1000,
            tier: "GREEN",
            emailHash: null,
            user: user,
            created: 1654013672253000,
            card: null,
            stockKeepingUnitRarity: null,
            version: "1",
            skn: "STATIC"
        }]

        queryResult[0][Datastore.KEY] = {
            name: "338a6b3128"
        }

        queryResult[1][Datastore.KEY] = {
            name: "07e6554733"
        }

        const fakeRunQuery = sinon.fake.resolves([queryResult]);
        sinon.replace(ItemRepository.datastore, "runQuery", fakeRunQuery);

        const results = await instance.byUser(platform, user);
        expect(results).eql([
            new ItemEntityData(
                "338a6b3128",
                14,
                10000,
                "Common Octahedron",
                "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
                null,
                user,
                "TEST",
                "TEST",
                "TEST-OCTAHEDRON-COMMON",
                "SALE",
                null,
                "GIVEAWAY",
                100,
                "MINTED",
                1657622239335000,
                null,
                null,
                "1",
                "STATIC"
            ),
            new ItemEntityData(
                "07e6554733",
                8,
                100,
                "Rare Cube",
                "The only regular solid which tessellates Euclidean space: the hexahedron.  The ancients believed this caused the solidity of the Earth.",
                null,
                user,
                "TEST",
                "TEST",
                "TEST-CUBE-RARE",
                "GIVEAWAY",
                "claim-123",
                "GREEN",
                1000,
                "MINTED",
                1654013672253000,
                null,
                null,
                "1",
                "STATIC"
            )
        ]
        )
    })

})

describe('persistence - byThumbprint', () => {

    let instance: ItemRepository;

    const platform = 'TEST';
    const thumbprint = 'edc3f52458';


    beforeEach(function () {
        instance = new ItemRepository();
    });

    afterEach(function () {
        sinon.restore();
    });

    it('uses correct query', () => {
        const fakeRunQuery = sinon.fake();
        sinon.replace(ItemRepository.datastore, "runQuery", fakeRunQuery);

        const key = ItemRepository.datastore.key(['item', thumbprint]);

        const expectedQuery = {
            namespace: 'drm',
            kinds: ['item'],
            selectVal: [
                'brandCode',
                'card',
                'claimCode',
                'created',
                'description',
                'emailHash',
                'maxQty',
                'nftState',
                'ownerAddress',
                'recommendedRetailPrice',
                'saleQty',
                'skn',
                'source',
                'stockKeepingUnitCode',
                'stockKeepingUnitName',
                'stockKeepingUnitRarity',
                'tier',
                'user',
                'version'
            ],
            filters: [
                { name: '__key__', op: '=', val: key },
                { name: 'platformCode', op: '=', val: platform },
                { name: 'state', op: '!=', val: 'DELETED' }
            ]
        }

        instance.byThumbprint(platform, thumbprint);
        sinon.assert.calledOnceWithExactly(fakeRunQuery, sinon.match(expectedQuery))
    })

    it('transforms results', async () => {

        const queryResult = [{
            saleQty: 14,
            maxQty: 10000,
            source: "SALE",
            nftState: "MINTED",
            claimCode: null,
            stockKeepingUnitName: 'Common Octahedron',
            description: "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
            brandCode: "TEST",
            stockKeepingUnitCode: "TEST-OCTAHEDRON-COMMON",
            recommendedRetailPrice: 100,
            emailHash: null,
            tier: "GIVEAWAY",
            user: "abc654",
            created: 1657622239335000,
            card: null,
            stockKeepingUnitRarity: null,
            version: "1",
            skn: "STATIC"
        }]

        queryResult[0][Datastore.KEY] = {
            name: thumbprint
        }


        const fakeRunQuery = sinon.fake.resolves([queryResult]);
        sinon.replace(ItemRepository.datastore, "runQuery", fakeRunQuery);

        const results = await instance.byThumbprint(platform, thumbprint);
        expect(results).eql(
            new ItemEntityData(
                thumbprint,
                14,
                10000,
                "Common Octahedron",
                "The air element. Octahedra are sparkling crystals of diamond, and magnetite.",
                null,
                "abc654",
                "TEST",
                "TEST",
                "TEST-OCTAHEDRON-COMMON",
                "SALE",
                null,
                "GIVEAWAY",
                100,
                "MINTED",
                1657622239335000,
                null,
                null,
                "1",
                "STATIC"
            )
        )
    })

})
