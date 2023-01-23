import { Request } from '@google-cloud/functions-framework';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AllConfig } from '../config/all-config';
import { EventPublisher } from '../eventstreaming/event-publisher';
import { ItemEvent } from '../eventstreaming/item-event';
import { ItemRepository } from '../persistence/item-repository';

let _repositoryInstance: ItemRepository = null;
export function repository(): ItemRepository {
  if (!_repositoryInstance) {
    _repositoryInstance = new ItemRepository();
  }
  return _repositoryInstance;
}

let _publisherInstance: EventPublisher<ItemEvent> = null;
export function publisher(cfg: AllConfig): EventPublisher<ItemEvent> {
  if (!_publisherInstance) {
    _publisherInstance = new EventPublisher(cfg.itemEventTopic);
  }
  return _publisherInstance;
}

export type ItemPathParams = {
  keyType: 'token' | 'nftAddress';
  key: string;
  platform: string;
  retailer: boolean;
}

export function parsePath(req: Request, res: Response): ItemPathParams | null {
  const parts = req.path.split('/');
  const retailer: boolean = parts.includes('retailer');

  if (parts.length < 2) {
    res.status(StatusCodes.BAD_REQUEST).send('platform code and ownership token (or nft.address) must be provided in path');
    return null;
  }

  const platform = parts[parts.length - 2];

  let key = parts[parts.length - 1];
  const keyType = key.startsWith('nft.') ? 'nftAddress' : 'token';
  if (keyType === 'nftAddress') {
    key = key.substring(4);
  }

  return { keyType, key, platform, retailer };
}
