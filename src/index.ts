if (process.env.NODE_ENV == 'development') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('source-map-support').install();
  require('dotenv/config')
}
import 'reflect-metadata';
import { HttpFunction } from '@google-cloud/functions-framework';
import logger from './helpers/logger';
import { AllConfig, loadConfig } from './config/all-config';
import { CreateNonEnumeratedItem } from './functions/create-non-enumerated-item';
import { functionWrapper } from './helpers/wrapper';
import { GetItems } from './functions/get-items';
import { GetItem } from './functions/get-item';
import { updateItemHandler } from './functions/update-item';
import { CreateEnumeratedItem } from './functions/create-enumerated-item';
import { createItemHandler } from './functions/create-item';

const CONFIG: Promise<AllConfig> = loadConfig(process.env);
CONFIG.catch(logger.error);

export const getItems: HttpFunction = async (req, res) => functionWrapper(GetItems.handler, req, res, CONFIG);
export const getItem: HttpFunction = async (req, res) => functionWrapper(GetItem.handler, req, res, CONFIG);
// TODO (PLATFORM-3285) delete
export const createNonEnumeratedItem: HttpFunction = async (req, res) => functionWrapper(CreateNonEnumeratedItem.handler, req, res, CONFIG);
// TODO (PLATFORM-3285) delete
export const createEnumeratedItem: HttpFunction = async (req, res) => functionWrapper(CreateEnumeratedItem.handler, req, res, CONFIG);
export const createItem: HttpFunction = async (req, res) => functionWrapper(createItemHandler, req, res, CONFIG);
export const updateItem: HttpFunction = async (req, res) => functionWrapper(updateItemHandler, req, res, CONFIG);

/**
 * For dev testing only
 */
export const devRouter: HttpFunction = async (req, res) => {
  if (req.path.startsWith('/item-get/')) {
    await getItem(req, res);
    return;
  }

  if (req.path.startsWith('/item-update/')) {
    await updateItem(req, res);
    return;
  }

  switch (req.path) {
    case '/item-find':
      await getItems(req, res);
      break;
    // TODO (PLATFORM-3285) delete
    case '/item-create-non-enumerated':
      await createNonEnumeratedItem(req, res);
      break;
    // TODO (PLATFORM-3285) delete
    case '/item-create-enumerated':
      await createEnumeratedItem(req, res);
      break;
    case '/item-create':
      await createItem(req, res);
      break;
    default:
      res.status(404).send(`Endpoint ${req.path} not found\n`);
  }
}
