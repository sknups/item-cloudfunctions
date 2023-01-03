import * as Joi from 'joi';
import { ConfigFragment } from './config-fragment';

export type ClientConfig = {
  catalogGetSkuUrl: string,
}

const CONFIG: ConfigFragment<ClientConfig> = {
  schema: {
    CF_BASE_URL: Joi.string().required(),
    CATALOG_BASE_URL: Joi.string().optional(),
    CATALOG_GET_SKU_FUNCTION: Joi.string().default('catalog-get-sku'),
  },
  load: (envConfig: NodeJS.Dict<string>): ClientConfig => {
    const baseUrl = envConfig.CATALOG_BASE_URL ?? envConfig.CF_BASE_URL;
    return {
      catalogGetSkuUrl: `${baseUrl}/${envConfig.CATALOG_GET_SKU_FUNCTION}`,
    };
  },
};

export default CONFIG;
