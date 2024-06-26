/* eslint-disable @typescript-eslint/no-explicit-any */
import { mocked } from 'jest-mock';
import { EventPublisher } from '../src/eventstreaming/event-publisher';
import { MutationResult } from '../src/helpers/persistence/mutation-result';
import { AllConfig } from '../src/config/all-config';
import { TEST_SKUS } from './test-data-skus';
import { GaxiosError } from 'gaxios';
import { StatusCodes } from 'http-status-codes';

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
  getSku: jest.fn().mockImplementation((_cfg, skuCode) => TEST_SKUS[skuCode])
}

const stock = {
  createStockItem: jest.fn()
    .mockImplementation((_cfg: AllConfig, platform: string, sku: string) => {

      const noStockError = new GaxiosError('Simulated stock not found error', {}, {
        status: StatusCodes.NOT_FOUND,
        statusText: 'NOT_FOUND',
        config: {},
        data: { code: 'STOCK_00400', message: 'Simulated stock not found error' },
        headers: {},
        request: { responseURL: '' },
      });

      if (platform != 'SKN') {
        throw noStockError;
      }

      switch (sku) {
        case 'GIVEAWAY-V1':
          return { platform, sku, issue: 949877, issued: 949877 };

        case 'PREMIUM-V1':
          return { platform, sku, issue: 629, issued: 629 };

        case 'PREMIUM-V2':
        case 'TEST-ICOSAHEDRON-GREEN':
          return { platform, sku, issue: 5699, issued: 5699 };

        case 'PREMIUM-V3':
        case 'TEST-TETRAHEDRON-PURPLE':
        case 'PREMIUM-V3-WITHOUT-MINT':
          return { platform, sku, issue: 2056, issued: 2056 };
        case 'PREMIUM-V3-WITHOUT-PRICE':
          return { platform, sku };

        case 'DROPLINK-V3':
          return { platform, sku, issue: 467, issued: 3 };

        case 'PREMIUM-V3-WITH-ZERO-STOCK':
          throw new GaxiosError('Simulated out of stock error', {}, {
            status: StatusCodes.FORBIDDEN,
            statusText: 'FORBIDDEN',
            config: {},
            data: { code: 'STOCK_00500', message: 'Simulated out of stock error' },
            headers: {},
            request: { responseURL: '' },
          });

        case 'PREMIUM-V3-WITH-STOCK-ERROR':
          throw new Error('Unexpected error retrieving stock PREMIUM-V3-WITH-STOCK-ERROR');

        default:
          throw noStockError;
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
  stock,
  datastoreHelper,
  eventPublisher,
  mockClear: () => {
    stock.createStockItem.mockClear();
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
jest.mock('../src/client/catalog/stock.client', () => stock);
jest.mock('../src/helpers/datastore/datastore.helper', () => datastoreHelper);
jest.mock('../src/eventstreaming/event-publisher');
