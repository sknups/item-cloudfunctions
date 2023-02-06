import { AllConfig } from '../../config/all-config';
import { GaxiosResponse } from 'gaxios';
import { httpClient } from '../../helpers/http/http.helper';

export type Stock = {
  sku: string,
  stock: number,
}

export async function updateStock(cfg: AllConfig, skuCode: string): Promise<Stock> {
  const client = await httpClient(cfg.stockUpdateUrl);

  const resp: GaxiosResponse<Stock> = await client.request({ method: 'PUT', url: `${cfg.stockUpdateUrl}/${skuCode}` });
  return resp.data;
}
