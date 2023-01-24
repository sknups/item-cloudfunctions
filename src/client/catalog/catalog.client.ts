import { AllConfig } from '../../config/all-config';
import { GaxiosResponse } from 'gaxios';
import { httpClient } from '../../helpers/http/http.helper';
import { StatusCodes } from 'http-status-codes';
import logger from '../../helpers/logger';

type SkuPermission = 'GIVEAWAY' | 'SELL' | 'DISCOVER' | 'METAPLEX_MINT';

export type Sku = {
  code: string,
  version: string,
  name: string,
  description: string,
  maxQty?: number | null,
  card?: string | null,
  skn: string | null,
  tier?: string | null,
  rarity?: number | null,
  platformCode: string,
  recommendedRetailPrice?: number | null,
  brandWholesalePrice?: number | null,
  brandCode: string,
  brandName: string,
  brandWholesalerShare: number | null,
  permissions: SkuPermission[],
  media?: string | null,
}

export async function getSku(cfg: AllConfig, skuCode: string): Promise<Sku | null> {
  const client = await httpClient(cfg.catalogGetSkuUrl);

  try {
    const resp: GaxiosResponse<Sku> = await client.request({ url: `${cfg.catalogGetSkuUrl}/${skuCode}` });
    if (!resp.data.code) {
      logger.error(`Retrieved SKU, but no SKU code was included in the response: ${JSON.stringify(resp.data)}`);
      return null;
    }
    return resp.data;
  } catch (e) {
    if (e.response?.status === StatusCodes.NOT_FOUND) {
      return null;
    } else {
      throw e;
    }
  }
}
