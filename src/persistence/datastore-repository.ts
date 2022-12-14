import { Datastore, Transaction } from '@google-cloud/datastore';
import { ClassConstructor, plainToClass } from 'class-transformer';

const DATASTORES_BY_NS = {}

function _datastore(namespace: string): Datastore {
  if (!DATASTORES_BY_NS[namespace]) {
    DATASTORES_BY_NS[namespace] = new Datastore({ namespace: namespace });
  }
  return DATASTORES_BY_NS[namespace];
}

export function transaction(namespace: string): Transaction {
  return _datastore(namespace).transaction();
}

export async function getEntity<T>(cls: ClassConstructor<T>, namespace: string, kind: string, key: string, tx?: Transaction): Promise<T | null> {
  const datastore = _datastore(namespace);
  const resultEntity = await (tx ?? datastore).get(datastore.key([kind, key]));
  if (resultEntity[0]) {
    return plainToClass(cls, resultEntity[0]);
  } else {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveEntity(namespace: string, kind: string, key: string | null, data: any, tx?: Transaction): Promise<void> {
  const datastore = _datastore(namespace);
  await (tx ?? datastore).save({
    key: datastore.key(key ? [kind, key] : [kind]),
    data: data,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function insertEntity(namespace: string, kind: string, key: string | null, data: any, tx?: Transaction): Promise<void> {
  const datastore = _datastore(namespace);
  await (tx ?? datastore).insert({
    key: datastore.key(key ? [kind, key] : [kind]),
    data: data,
  });
}

export async function deleteEntity(namespace: string, kind: string, key: string, tx?: Transaction): Promise<void> {
  const datastore = _datastore(namespace);
  await (tx ?? datastore).delete(datastore.key([kind, key]));
}
