import * as Joi from 'joi';
import { ConfigFragment } from './config-fragment';

export type MediaConfig = {
  assetsHost: string,
  flexHost: string,
}

const CONFIG: ConfigFragment<MediaConfig> = {
  schema: {
    ASSETS_HOST: Joi.string().required(),
    FLEX_HOST: Joi.string().required(),
  },
  load: (envConfig: NodeJS.Dict<string>): MediaConfig => {
    return {
      assetsHost: envConfig.ASSETS_HOST,
      flexHost: envConfig.FLEX_HOST,
    };
  },
};

export default CONFIG;
