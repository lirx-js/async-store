import { Abortable, AsyncTask, IAbortableOptions } from '@lirx/async-task';
import { IAsyncTaskConstraint } from '@lirx/async-task/src/async-task/types/async-task-constraint.type';
import { noop } from '@lirx/utils';
import { IAsyncStore } from '../../async-store.type';
import { IAsyncStoreGetFunctionReturnedValue } from '../../traits/get/async-store.get.function-definition';
import { IAsyncStoreSetFunctionValue } from '../../traits/set/async-store.set.function-definition';
import { InferAsyncStoreEntryGKey, InferAsyncStoreEntryGValue } from '../../types/async-store-entry.type';
import { promisifyIDBRequest } from './helpers/promisify-idb-request';
import { IGenericIDBAsyncStoreEntry } from './types/idb-async-store-entry.type';

/**
 * Doc:
 *
 * https://github.com/jakearchibald/idb-keyval/blob/main/src/index.ts
 */

export interface IIDBAsyncStoreOptions {
  readonly db: IDBDatabase;
  readonly storeName: string;
}

export interface IIDBAsyncStoreOpenOptions extends IAbortableOptions, Omit<IIDBAsyncStoreOptions, 'db' | 'storeName'>, Partial<Pick<IIDBAsyncStoreOptions, 'storeName'>> {
  readonly dbName?: string;
}

export class IDBAsyncStore<GEntry extends IGenericIDBAsyncStoreEntry> implements IAsyncStore<GEntry> {

  static open<GEntry extends IGenericIDBAsyncStoreEntry>(
    {
      dbName = 'async-store',
      storeName = 'keyval',
      abortable,
    }: IIDBAsyncStoreOpenOptions,
  ): AsyncTask<IDBAsyncStore<GEntry>> {
    return AsyncTask.fromFactory((abortable: Abortable): AsyncTask<IDBDatabase> => {
      const request: IDBOpenDBRequest = indexedDB.open(dbName);
      request.onupgradeneeded = () => request.result.createObjectStore(storeName);
      return promisifyIDBRequest<IDBDatabase>(request, abortable);
    }, abortable)
      .successful((db: IDBDatabase): IDBAsyncStore<GEntry> => {
        return new IDBAsyncStore<GEntry>({
          db,
          storeName,
        });
      });

  }

  readonly #db: IDBDatabase;
  readonly #storeName: string;

  constructor(
    {
      db,
      storeName,
    }: IIDBAsyncStoreOptions,
  ) {
    this.#db = db;
    this.#storeName = storeName;
  }

  #getStore(
    mode: IDBTransactionMode,
  ): IDBObjectStore {
    return this.#db.transaction(this.#storeName, mode).objectStore(this.#storeName);
  }

  #runIDBRequest<GValue extends IAsyncTaskConstraint<GValue>>(
    factory: (store: IDBObjectStore, abortable: Abortable) => IDBRequest<GValue>,
    mode: IDBTransactionMode,
    abortable: Abortable,
  ): AsyncTask<GValue> {
    return AsyncTask.fromFactory((abortable: Abortable): AsyncTask<GValue> => {
      return promisifyIDBRequest<GValue>(
        factory(this.#getStore(mode), abortable),
        abortable,
      );
    }, abortable);
  }

  get<GKey extends InferAsyncStoreEntryGKey<GEntry>>(
    key: GKey,
    abortable: Abortable,
  ): AsyncTask<IAsyncStoreGetFunctionReturnedValue<GEntry, GKey>> {
    return this.#runIDBRequest<any>((store: IDBObjectStore): IDBRequest<any> => {
      return store.get(key);
    }, 'readonly', abortable);
  }

  set<GKey extends InferAsyncStoreEntryGKey<GEntry>>(
    key: GKey,
    value: IAsyncStoreSetFunctionValue<GEntry, GKey>,
    abortable: Abortable,
  ): AsyncTask<void> {
    return this.#runIDBRequest<IDBValidKey>((store: IDBObjectStore): IDBRequest<IDBValidKey> => {
      return store.put(value, key);
    }, 'readwrite', abortable)
      .successful(noop);
  }

  delete(
    key: InferAsyncStoreEntryGKey<GEntry>,
    abortable: Abortable,
  ): AsyncTask<void> {
    return this.#runIDBRequest<void>((store: IDBObjectStore): IDBRequest<void> => {
      return store.delete(key) as IDBRequest<void>;
    }, 'readwrite', abortable);
  }

  clear(
    abortable: Abortable,
  ): AsyncTask<void> {
    return this.#runIDBRequest<void>((store: IDBObjectStore): IDBRequest<void> => {
      return store.clear() as IDBRequest<void>;
    }, 'readwrite', abortable);
  }

  keys(
    abortable: Abortable,
  ): AsyncTask<InferAsyncStoreEntryGKey<GEntry>[]> {
    return this.#runIDBRequest<IDBValidKey[]>((store: IDBObjectStore): IDBRequest<IDBValidKey[]> => {
      return store.getAllKeys();
    }, 'readonly', abortable) as AsyncTask<InferAsyncStoreEntryGKey<GEntry>[]>;
  }

  values(
    abortable: Abortable,
  ): AsyncTask<InferAsyncStoreEntryGValue<GEntry>[]> {
    return this.#runIDBRequest<any[]>((store: IDBObjectStore): IDBRequest<any[]> => {
      return store.getAll();
    }, 'readonly', abortable);
  }

  entries(
    abortable: Abortable,
  ): AsyncTask<GEntry[]> {
    return AsyncTask.all([
      (abortable: Abortable) => this.keys(abortable),
      (abortable: Abortable) => this.values(abortable),
    ], abortable)
      .successful(([keys, values]: [any[], any[]]): GEntry[] => {
        return keys.map((key: any, index: number): GEntry => {
          return [
            key,
            values[index],
          ] as unknown as GEntry;
        });
      });
  }
}

export type IGenericIDBAsyncStore = IDBAsyncStore<IGenericIDBAsyncStoreEntry>;

// const a = new IDBAsyncStore<['b', boolean]>(null as any);
// const b = a.get('a', null as any);
// const c = a.get('b', null as any);
// const c = a.set('a', null as any, null as any);
// const c = a.set('b', 'string', null as any);
// const c = a.set('b', true, null as any);
//
// const fnc = (store: IGenericIDBAsyncStore) => {
//
// };
//
// fnc(a);

