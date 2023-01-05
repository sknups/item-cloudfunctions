import { BaseEvent } from './base-event';
import { PubSub, Topic } from '@google-cloud/pubsub';
import logger from '../helpers/logger';
import { validateOrThrow } from '../helpers/validation';

/**
 * TODO - move all eventstreaming to npm library
 */
export class EventPublisher<T extends BaseEvent> {
  private readonly topic: Topic;

  constructor(topicName: string) {
    this.topic = new PubSub().topic(topicName);
  }

  public async publishEvent(event: T): Promise<void> {
    await validateOrThrow(event, { whitelist: true, forbidNonWhitelisted: true });

    let json = '';
    try {
      json = JSON.stringify(event);
      const messageId = await this.topic.publishMessage({
        attributes: {
          eventId: event.eventId,
          dataType: event.getDataType(),
          dataEvent: event.dataEvent,
        },
        data: Buffer.from(json),
      });
      logger.info(`Published ${event.constructor?.name} with message id ${messageId} and event id ${event.eventId} to topic ${this.topic.name}`);
    } catch (e) {
      logger.error(`Failed to publish message: ${json}`, e)
    }
  }
}
