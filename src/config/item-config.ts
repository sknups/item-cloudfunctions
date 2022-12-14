import * as Joi from 'joi';
import { ConfigFragment } from './config-fragment';

export type ItemConfig = {
  flexUrl: string,
  itemEventTopic: string,
  sknAppUrl: string,
}

const CONFIG: ConfigFragment<ItemConfig> = {
  schema: {
    FLEX_URL: Joi.string().required(),
    ITEM_EVENT_TOPIC: Joi.string().default('drm-item-event'),
    SKNAPP_URL: Joi.string().required(),
  },
  load: (envConfig: NodeJS.Dict<string>): ItemConfig => {
    return {
      flexUrl: envConfig.FLEX_URL,
      itemEventTopic: envConfig.ITEM_EVENT_TOPIC,
      sknAppUrl: envConfig.SKNAPP_URL,
    };
  },
};

export default CONFIG;
