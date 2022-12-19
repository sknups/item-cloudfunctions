/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassConstructor } from 'class-transformer';
import { mocked } from 'jest-mock';
import { EventPublisher } from '../src/eventstreaming/event-publisher';
import { MutationResult } from '../src/helpers/persistence/mutation-result';
import { SkuEntity } from '../src/persistence/sku-entity';

export function mockSkuEntity(): SkuEntity {
  return {
    brandCode: 'brandCode',
    brandName: 'brandName',
    brandWholesalePrice: null,
    brandWholesalerShare: 0.3,
    card: 'card',
    created: new Date(),
    description: 'description',
    discover: 'discover',
    maxQty: null,
    name: 'name',
    nftMasterAddress: null,
    nftState: 'UNMINTED',
    permissions: 'permissions',
    platformCode: 'platformCode',
    rarity: null,
    recommendedRetailPrice: null,
    tier: 'GIVEAWAY',
    updated: new Date(),
    skn: 'STATIC',
    version: '2',
  };
}

/**
 * Creates a mock reply for Transaction.commit()
 *
 * Create-giveaway-item relies on this to detect the key inserted into the audit kind when creating an item.
 * This is used to publish the item event.
 *
 * @param kind the datastore kind
 * @param id the id reported to have been generated for this kind
 * @returns a response to Transaction.commit()
 */
export function mockDatastoreCommitResponse(kind: string, id: number): any {
  return [
    {
      mutationResults: [{
        key: {
          path: [{ kind, id }],
        }
      }],
    }
  ];
}

export function mockCommitTransactionResponse(kind: string, key: number): MutationResult[] {
  return [{
    key,
    kind,
  }];
}

const datastoreRepository = {
  getEntity: jest.fn()
    .mockImplementation((_cls: ClassConstructor<object>, namespace: string, kind: string, key: string) => {
      switch (`${namespace}.${kind}.${key}`) {
        case 'catalog.sku.skuCode':
          return mockSkuEntity();
        case 'catalog.sku.skuv1': {
          const sku = mockSkuEntity();
          sku.version = '1';
          return sku;
        }
        case 'catalog.sku.skuWithMaxQty': {
          const sku = mockSkuEntity();
          sku.maxQty = 500;
          return sku;
        }
        default:
          return null;
      }
    }),
}

const datastoreHelper = {
  createContext: jest.fn(),
  insertEntity: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
}

const eventPublisher = mocked(EventPublisher);

export const mocks = {
  datastoreRepository,
  datastoreHelper,
  eventPublisher,
  mockClear: () => {
    datastoreRepository.getEntity.mockClear();
    datastoreHelper.createContext.mockClear();
    datastoreHelper.insertEntity.mockClear();
    datastoreHelper.startTransaction.mockClear();
    datastoreHelper.commitTransaction.mockClear();
    datastoreHelper.rollbackTransaction.mockClear();

    // As EventPublisher is never recreated, just clear the mock methods of all instances (should only be 1 instance)
    eventPublisher.mock.instances.forEach(i => mocked(i.publishEvent).mockClear());
  },
}

jest.mock('../src/persistence/datastore-repository', () => datastoreRepository);
jest.mock('../src/helpers/datastore/datastore.helper', () => datastoreHelper);
jest.mock('../src/eventstreaming/event-publisher');
