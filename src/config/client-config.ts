import * as Joi from 'joi';
import { ConfigFragment } from './config-fragment';

export type ClientConfig = {
  catalogGetSkuUrl: string,
  stockCreateIssue: string,
}

const CONFIG: ConfigFragment<ClientConfig> = {
  schema: {
    CF_BASE_URL: Joi.string().required(),
    CATALOG_GET_SKU_FUNCTION: Joi.string().default('catalog-get-sku'),
    STOCK_CREATE_ISSUE_FUNCTION: Joi.string().optional().default('stock-create-issue'),
  },
  load: (envConfig: NodeJS.Dict<string>): ClientConfig => {
    const baseUrl = envConfig.CF_BASE_URL;
    return {
      catalogGetSkuUrl: `${baseUrl}/${envConfig.CATALOG_GET_SKU_FUNCTION}`,
      stockCreateIssue: `${baseUrl}/${envConfig.STOCK_CREATE_ISSUE_FUNCTION}`,
    };
  },
};

export default CONFIG;
