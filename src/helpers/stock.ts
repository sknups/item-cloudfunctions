import { AppError, CREATE_STOCK_ITEM_FAILED, OUT_OF_STOCK, STOCK_NOT_FOUND } from '../app.errors';
import { Sku } from '../client/catalog/catalog.client';
import { Stock, createStockItem } from '../client/catalog/stock.client';
import { AllConfig } from '../config/all-config';

export async function createStockItemOrThrow(cfg: AllConfig, sku: Sku, type: 'claim' | 'purchase'): Promise<Stock> {

  try {
    return await createStockItem(cfg, sku.platformCode, sku.code, type);
  } catch (e) {
    switch (e.response?.data?.code) {
      case 'STOCK_00400':
        throw new AppError(STOCK_NOT_FOUND(sku.platformCode, sku.code), e);
      case 'STOCK_00500':
        throw new AppError(OUT_OF_STOCK(sku.platformCode, sku.code), e);
      default:
        throw new AppError(CREATE_STOCK_ITEM_FAILED(sku.platformCode, sku.code), e);
    }
  }

}
