import * as Joi from 'joi';
import { ConfigFragment } from './config-fragment';

export type EmailHashingConfig = {
  emailHashingSecret: string,
}

const CONFIG: ConfigFragment<EmailHashingConfig> = {
  schema: {
    EMAIL_HASHING_SECRET: Joi.string().required(),
  },
  load: (envConfig: NodeJS.Dict<string>): EmailHashingConfig => {
    return {
      emailHashingSecret: envConfig.EMAIL_HASHING_SECRET,
    };
  },
};

export default CONFIG;
