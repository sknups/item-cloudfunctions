import { AllConfig } from '../../config/all-config';
import { GaxiosResponse } from 'gaxios';
import { httpClient } from '../../helpers/http/http.helper';
import { StatusCodes } from 'http-status-codes';
import logger from '../../helpers/logger';

export type Stock = {
  sku: string,
  quantity: number,
}

export async function updateStock(cfg: AllConfig, skuCode: string): Promise<Stock | null> {
  const client = await httpClient(cfg.stockUpdateUrl);

  try {
    const resp: GaxiosResponse<Stock> = await client.request({ method: 'PUT', url: `${cfg.stockUpdateUrl}/${skuCode}` });
    return resp.data;
  } catch (e) {
    if (e.response?.status === StatusCodes.NOT_FOUND) {
      return null;
    } 

    if (e.response?.status === StatusCodes.FORBIDDEN) {
      logger.error(`Updating stock for sku ${skuCode} forbidden, out of stock: ${JSON.stringify(e.response.data)}`);
      return null;   
    }
    
    throw e;
    
  }
}
