import { Datastore, Entity, PathType, Transaction } from '@google-cloud/datastore';
import { CommitResponse } from '@google-cloud/datastore/build/src/request';
import { BaseEntity, EntityKey } from '../persistence/base.entity';
import { Filter } from '../persistence/filter';
import { MutationResult } from '../persistence/mutation-result';

let _datastoreNamespace: string;
let _datastore: Datastore;

/**
 * Wraps the underlying datastore object and possible transaction.
 */
export type DatastoreContext = {
  datastore: Datastore;
  tx?: Transaction;
}

export function createContext(namespace: string): DatastoreContext {
  if (_datastore) {
    if (_datastoreNamespace !== namespace) {
      throw new Error(`Datastore context already initialised for namespace ${_datastoreNamespace}, cannot re-initialise for ${namespace}`)
    }
  } else {
    _datastore = new Datastore({ namespace });
    _datastoreNamespace = namespace;
  }

  return { datastore: _datastore };
}

/**
 * Starts a new datastore transaction.
 *
 * Use commitTransaction(context) or rollbackTransaction(context) to finalise it.
 * 
 * @param context the context returned by createContext
 *
 * @returns a new context which includes a wrapped transaction
 */
export async function startTransaction(context: DatastoreContext): Promise<DatastoreContext> {
  if (context.tx) {
    throw new Error('Cannot start a transaction as one was already detected in the supplied context');
  }
  const tx: Transaction = context.datastore.transaction();
  await tx.run();
  return { datastore: context.datastore, tx };
}

/**
 * Commits a transaction.
 *
 * @param context the context returned by startTransaction
 */
export async function commitTransaction(context: DatastoreContext): Promise<MutationResult[]> {
  if (!context.tx) {
    throw new Error('Cannot commit the transaction as one was not detected in the supplied context');
  }

  const response: CommitResponse = await context.tx.commit();

  if (!response[0].mutationResults) {
    return [];
  }

  return response[0].mutationResults.map(m => {
    if (m.key?.path && m.key?.path.length === 1) {
      return {
        key: (m.key.path[0].id ?? m.key.path[0].name) as EntityKey,
        kind: m.key.path[0].kind,
      };
    } else {
      return null;
    }
  });
}

/**
 * Rolls back a transaction.
 *
 * @param context the context returned by startTransaction
 */
export async function rollbackTransaction(context: DatastoreContext): Promise<void> {
  if (!context.tx) {
    throw new Error('Cannot rollback the transaction as one was not detected in the supplied context');
  }
  await context.tx.rollback();
}

export async function getEntity<T extends BaseEntity>(context: DatastoreContext, kind: string, key: EntityKey): Promise<T | null> {
  const ds = context.tx ?? context.datastore;

  const [entity] = await ds.get(context.datastore.key(_keyPath(kind, key)));

  if (!entity) {
    return null;
  }

  return _mapFromDatastoreEntity<T>(entity);
}

export async function insertEntity(context: DatastoreContext, kind: string, entity: BaseEntity): Promise<void> {
  const ds = context.tx ?? context.datastore;

  await ds.insert(_mapToDatastoreEntity(context, kind, entity));
}

export async function updateEntity(context: DatastoreContext, kind: string, entity: BaseEntity): Promise<void> {
  const ds = context.tx ?? context.datastore;

  await ds.update(_mapToDatastoreEntity(context, kind, entity));
}

export async function findEntities<T extends BaseEntity>(context: DatastoreContext, kind: string, filters: Filter[], projection?: string[]): Promise<T[]> {
  const ds = context.tx ?? context.datastore;

  const query = ds.createQuery(kind);
  query.filters = filters;

  if (projection) {
    // It is not possible to project properties in the filter, so remove them
    const filteredProjection = projection.filter(p => !filters.find(filter => p === filter.name));
    query.select(filteredProjection);
  }

  const [result] = await ds.runQuery(query);

  if (projection) {
    filters.filter(f => f.op === '=').forEach(f => {
      // For all '=' filters we can populate the value in the returned entity
      // For all other filters it is not possible to populate the value and therefore is left undefined
      result.forEach(r => r[f.name] = f.val);
    });
  }

  return result.map(entity => _mapFromDatastoreEntity(entity));
}

function _keyPath(kind: string, key: EntityKey): PathType[] {
  return key ? [kind, key] : [kind];
}

function _mapFromDatastoreEntity<T extends BaseEntity>(entity: Entity): T {
  const mapped = { ...entity };

  // replace the Datastore.KEY with a 'key' property
  mapped.key = mapped[Datastore.KEY].name ?? mapped[Datastore.KEY].id;
  delete mapped[Datastore.KEY];

  // convert created and updated from number to Date if found
  // this is due to Datastore projection queries returning dates as numeric (microsecond) values
  if (typeof mapped.created === 'number') {
    mapped.created = new Date(mapped.created / 1000);
  }
  if (typeof mapped.updated === 'number') {
    mapped.updated = new Date(mapped.updated / 1000);
  }

  return mapped as T;
}

function _mapToDatastoreEntity(context: DatastoreContext, kind: string, obj: BaseEntity) {
  const datastoreEntity = {
    key: context.datastore.key(_keyPath(kind, obj.key)),
    data: { ...obj },
  };
  delete datastoreEntity.data.key; // we don't want to persist the key as an additional 'key' column
  return datastoreEntity;
}
