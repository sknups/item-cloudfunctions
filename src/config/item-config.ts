import * as Joi from 'joi';
import { ConfigFragment } from './config-fragment';

export type ItemConfig = {
  assetsUrl: string,
  flexUrl: string,
  itemEventTopic: string,
}

const CONFIG: ConfigFragment<ItemConfig> = {
  schema: {
    ASSETS_URL: Joi.string().required(),
    FLEX_URL: Joi.string().required(),
    ITEM_EVENT_TOPIC: Joi.string().default('drm-item-event'),
  },
  load: (envConfig: NodeJS.Dict<string>): ItemConfig => {
    return {
      assetsUrl: envConfig.ASSETS_URL,
      flexUrl: envConfig.FLEX_URL,
      itemEventTopic: envConfig.ITEM_EVENT_TOPIC,
    };
  },
};

export default CONFIG;
