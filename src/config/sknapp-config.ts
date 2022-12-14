import * as Joi from 'joi';
import { ConfigFragment } from './config-fragment';

export type SknAppConfig = {
  sknappHost: string,
}

const CONFIG: ConfigFragment<SknAppConfig> = {
  schema: {
    SKNAPP_HOST: Joi.string().required(),
  },
  load: (envConfig: NodeJS.Dict<string>): SknAppConfig => {
    return {
      sknappHost: envConfig.SKNAPP_HOST,
    };
  },
};

export default CONFIG;
