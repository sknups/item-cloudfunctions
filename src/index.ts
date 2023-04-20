if (process.env.NODE_ENV == 'development') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('source-map-support').install();
  require('dotenv/config')
}
import 'reflect-metadata';
import { HttpFunction } from '@google-cloud/functions-framework';
import logger from './helpers/logger';
import { AllConfig, loadConfig } from './config/all-config';
import { functionWrapper } from './helpers/wrapper';
import { GetItems } from './functions/get-items';
import { GetItem } from './functions/get-item';
import { FindLastIssued } from './functions/find-last-issued';
import { updateItemHandler } from './functions/update-item';
import { createItemHandler } from './functions/create-item';
import { createItemFromDropLinkHandler } from './functions/create-item-from-drop-link';
import { createItemFromGiveawayHandler } from './functions/create-item-from-giveaway';
import { createItemFromPurchaseHandler } from './functions/create-item-from-purchase';
import { CountItems } from './functions/count-items';

const CONFIG: Promise<AllConfig> = loadConfig(process.env);
CONFIG.catch(logger.error);

export const getItems: HttpFunction = async (req, res) => functionWrapper(GetItems.handler, req, res, CONFIG);
export const getItem: HttpFunction = async (req, res) => functionWrapper(GetItem.handler, req, res, CONFIG);
export const createItem: HttpFunction = async (req, res) => functionWrapper(createItemHandler, req, res, CONFIG);
export const createItemFromDropLink: HttpFunction = async (req, res) => functionWrapper(createItemFromDropLinkHandler, req, res, CONFIG);
export const createItemFromGiveaway: HttpFunction = async (req, res) => functionWrapper(createItemFromGiveawayHandler, req, res, CONFIG);
export const createItemFromPurchase: HttpFunction = async (req, res) => functionWrapper(createItemFromPurchaseHandler, req, res, CONFIG);
export const updateItem: HttpFunction = async (req, res) => functionWrapper(updateItemHandler, req, res, CONFIG);
export const findLastIssued: HttpFunction = async (req, res) => functionWrapper(FindLastIssued.handler, req, res, CONFIG);
export const countItems: HttpFunction = async (req, res) => functionWrapper(CountItems.handler, req, res, CONFIG);

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
    case '/item-find-last-issued':
      await findLastIssued(req, res);
      break;
    case '/item-create':
      await createItem(req, res);
      break;
    case '/item-create-from-drop-link':
      await createItemFromDropLink(req, res);
      break;
    case '/item-create-from-giveaway':
      await createItemFromGiveaway(req, res);
      break;
    case '/item-create-from-purchase':
      await createItemFromPurchase(req, res);
      break;
    case '/item-count':
      await countItems(req, res);
      break;
    default:
      res.status(404).send(`Endpoint ${req.path} not found\n`);
  }
}
