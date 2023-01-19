/* eslint-disable @typescript-eslint/no-explicit-any */
import { mocked } from 'jest-mock';
import { EventPublisher } from '../src/eventstreaming/event-publisher';
import { MutationResult } from '../src/helpers/persistence/mutation-result';
import { Sku } from '../src/client/catalog/catalog.client';
import { AllConfig } from '../src/config/all-config';

export function mockSku(code: string): Sku {
  return {
    code,
    brandCode: 'brandCode',
    brandName: 'brandName',
    brandWholesalePrice: null,
    brandWholesalerShare: 0.3,
    card: 'card',
    description: 'description',
    maxQty: null,
    name: 'name',
    platformCode: 'platformCode',
    rarity: null,
    recommendedRetailPrice: null,
    tier: 'GIVEAWAY',
    skn: 'STATIC',
    version: '2',
    permissions: ['METAPLEX_MINT'],
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

const catalog = {
  getSku: jest.fn()
    .mockImplementation((_cfg: AllConfig, skuCode: string) => {
      switch (skuCode) {
        case 'skuCode':
          return mockSku('skuCode');
        case 'TEST-OCTAHEDRON-COMMON':
          return mockSku('TEST-OCTAHEDRON-COMMON');
        case 'skuv1': {
          const sku = mockSku('skuv1');
          sku.version = '1';
          return sku;
        }
        case 'skuWithMaxQty': {
          const sku = mockSku('skuWithMaxQty');
          sku.maxQty = 500;
          return sku;
        }
        case 'skuWithoutMint': {
          const sku = mockSku('skuWithoutMint');
          sku.permissions = [];
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
  catalog,
  datastoreHelper,
  eventPublisher,
  mockClear: () => {
    catalog.getSku.mockClear();
    datastoreHelper.createContext.mockClear();
    datastoreHelper.insertEntity.mockClear();
    datastoreHelper.startTransaction.mockClear();
    datastoreHelper.commitTransaction.mockClear();
    datastoreHelper.rollbackTransaction.mockClear();

    // As EventPublisher is never recreated, just clear the mock methods of all instances (should only be 1 instance)
    eventPublisher.mock.instances.forEach(i => mocked(i.publishEvent).mockClear());
  },
}

jest.mock('../src/client/catalog/catalog.client', () => catalog);
jest.mock('../src/helpers/datastore/datastore.helper', () => datastoreHelper);
jest.mock('../src/eventstreaming/event-publisher');
