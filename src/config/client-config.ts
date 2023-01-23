import * as Joi from 'joi';
import { ConfigFragment } from './config-fragment';

export type ClientConfig = {
  catalogGetSkuUrl: string,
  stockUpdateUrl: string,
}

const CONFIG: ConfigFragment<ClientConfig> = {
  schema: {
    CF_BASE_URL: Joi.string().required(),
    CATALOG_GET_SKU_FUNCTION: Joi.string().default('catalog-get-sku'),
    STOCK_UPDATE_FUNCTION: Joi.string().optional().default('stock-update'),
  },
  load: (envConfig: NodeJS.Dict<string>): ClientConfig => {
    const baseUrl = envConfig.CF_BASE_URL;
    return {
      catalogGetSkuUrl: `${baseUrl}/${envConfig.CATALOG_GET_SKU_FUNCTION}`,
      stockUpdateUrl: `${baseUrl}/${envConfig.STOCK_UPDATE_FUNCTION}`,
    };
  },
};

export default CONFIG;
