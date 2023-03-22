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
