import { Abortable, AsyncTask, IAbortableOptions } from '@lirx/async-task';
import { IAsyncTaskConstraint } from '@lirx/async-task/src/async-task/types/async-task-constraint.type';
import { noop } from '@lirx/utils';
import { IAsyncStore } from '../../async-store.type';
import { IAsyncStoreEntry } from '../../traits/entries/async-store.entries.function-definition';
import { promisifyIDBRequest } from './helpers/promisify-idb-request';

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

export class IDBAsyncStore implements IAsyncStore {

  static open(
    {
      dbName = 'async-store',
      storeName = 'keyval',
      abortable,
    }: IIDBAsyncStoreOpenOptions,
  ): AsyncTask<IDBAsyncStore> {
    return AsyncTask.fromFactory((abortable: Abortable): AsyncTask<IDBDatabase> => {
      const request: IDBOpenDBRequest = indexedDB.open(dbName);
      request.onupgradeneeded = () => request.result.createObjectStore(storeName);
      return promisifyIDBRequest<IDBDatabase>(request, abortable);
    }, abortable)
      .successful((db: IDBDatabase): IDBAsyncStore => {
        return new IDBAsyncStore({
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

  get(
    key: string,
    abortable: Abortable,
  ): AsyncTask<any> {
    return this.#runIDBRequest<any>((store: IDBObjectStore): IDBRequest<any> => {
      return store.get(key);
    }, 'readonly', abortable);
  }

  set(
    key: string,
    value: any,
    abortable: Abortable,
  ): AsyncTask<void> {
    return this.#runIDBRequest<IDBValidKey>((store: IDBObjectStore): IDBRequest<IDBValidKey> => {
      return store.put(value, key);
    }, 'readwrite', abortable)
      .successful(noop);
  }

  delete(
    key: string,
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
  ): AsyncTask<string[]> {
    return this.#runIDBRequest<string[]>((store: IDBObjectStore): IDBRequest<string[]> => {
      return store.getAllKeys() as any;
    }, 'readonly', abortable);
  }

  values(
    abortable: Abortable,
  ): AsyncTask<any[]> {
    return this.#runIDBRequest<any[]>((store: IDBObjectStore): IDBRequest<any[]> => {
      return store.getAll();
    }, 'readonly', abortable);
  }

  entries(
    abortable: Abortable,
  ): AsyncTask<IAsyncStoreEntry[]> {
    return AsyncTask.all([
      (abortable: Abortable) => this.keys(abortable),
      (abortable: Abortable) => this.values(abortable),
    ], abortable)
      .successful(([keys, values]: [string[], any[]]): IAsyncStoreEntry[] => {
        return keys.map((key: string, index: number): IAsyncStoreEntry => {
          return [
            key,
            values[index],
          ];
        });
      });
  }
}




