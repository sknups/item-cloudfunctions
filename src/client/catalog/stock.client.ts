import { AllConfig } from '../../config/all-config';
import { GaxiosResponse } from 'gaxios';
import { httpClient } from '../../helpers/http/http.helper';

export type Stock = {
  /**
   * SKU code that stock relates to
   */
  sku: string;

  /**
   * SKU code that stock relates to
   */
  platform: string;

  /**
   *The advertised available stock
   */
  available: number;

  /**
   * The issue number that should be used by the item
   */
  issue: number;


  /**
   * The the number of items issued
   */
  issued: number

  /**
  * The maximum for SKU 
  */
  maximum: number;

  /**
   * remaining reserved for claims
   */
  reserved: number;

  /**
  * the withheld quantity
  */
  withheld: number;

  /**
   * The expiry date of SKU in ISO 8601 format. After this date the SKU
   * will be shown as out of stock.
   */
  expires: string | null;

  /**
   * allocation type
   * SEQUENTIAL - allocates sequential issue numbers
   * RANDOM - allocates pseudorandom issue numbers
   */
  allocation: string;
}

export async function createStockItem(cfg: AllConfig, platform: string, sku: string, type: 'claim' | 'purchase'): Promise<Stock> {
  const client = await httpClient(cfg.stockCreateIssue);

  const resp: GaxiosResponse<Stock> = await client.request({ method: 'POST', url: `${cfg.stockCreateIssue}/${platform}/${sku}/${type}` });
  return resp.data;
}
