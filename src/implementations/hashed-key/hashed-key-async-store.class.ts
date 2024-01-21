import { Abortable, AsyncTask } from '@lirx/async-task';
import { IAsyncStore } from '../../async-store.type';
import { IAsyncStoreGetFunctionReturnedValue } from '../../traits/get/async-store.get.function-definition';
import { IAsyncStoreSetFunctionValue } from '../../traits/set/async-store.set.function-definition';
import {
  IAsyncStoreEntry,
  IGenericAsyncStoreEntry,
  InferAsyncStoreEntryGKey,
  InferAsyncStoreEntryGValue,
} from '../../types/async-store-entry.type';

export type IHashedKeyAsyncStoreSubStoreEntry<GEntry extends IGenericAsyncStoreEntry> =
  IAsyncStoreEntry<string, InferAsyncStoreEntryGValue<GEntry>>
// GEntry extends IAsyncStoreEntry<infer GKey, any>
//   ? IAsyncStoreEntry<GKey, Uint8Array>
//   : any
  ;

export type IHashedKeyAsyncStoreSubStore<GEntry extends IGenericAsyncStoreEntry> =
  IAsyncStore<IHashedKeyAsyncStoreSubStoreEntry<GEntry>>
  ;

export interface IHashedKeyAsyncStoreOptions<GEntry extends IGenericAsyncStoreEntry> {
  readonly store: IHashedKeyAsyncStoreSubStore<GEntry>;
}

export class HashedKeyAsyncStore<GEntry extends IGenericAsyncStoreEntry> implements IAsyncStore<GEntry> {
  static hash(
    data: any,
    abortable: Abortable,
  ): AsyncTask<string> {
    return AsyncTask.fromFactory((): Promise<ArrayBuffer> => {
      return crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(JSON.stringify(data)),
      );
    }, abortable)
      .successful((key: ArrayBuffer): string => {
        return [...new Uint8Array(key)]
          .map(x => x.toString(16).padStart(2, '0'))
          .join('');
      });
  }

  readonly #store: IHashedKeyAsyncStoreSubStore<GEntry>;

  constructor(
    {
      store,
    }: IHashedKeyAsyncStoreOptions<GEntry>,
  ) {
    this.#store = store;
  }

  get<GKey extends InferAsyncStoreEntryGKey<GEntry>>(
    key: GKey,
    abortable: Abortable,
  ): AsyncTask<IAsyncStoreGetFunctionReturnedValue<GEntry, GKey>> {
    return HashedKeyAsyncStore.hash(key, abortable)
      .successful((key: string, abortable: Abortable): AsyncTask<IAsyncStoreGetFunctionReturnedValue<GEntry, GKey>> => {
        return this.#store.get(key, abortable) as AsyncTask<IAsyncStoreGetFunctionReturnedValue<GEntry, GKey>>;
      });
  }

  set<GKey extends InferAsyncStoreEntryGKey<GEntry>>(
    key: GKey,
    value: IAsyncStoreSetFunctionValue<GEntry, GKey>,
    abortable: Abortable,
  ): AsyncTask<void> {
    return HashedKeyAsyncStore.hash(key, abortable)
      .successful((key: string, abortable: Abortable): AsyncTask<void> => {
        return this.#store.set(key, value as any, abortable);
      });
  }

  delete(
    key: InferAsyncStoreEntryGKey<GEntry>,
    abortable: Abortable,
  ): AsyncTask<void> {
    return HashedKeyAsyncStore.hash(key, abortable)
      .successful((key: string, abortable: Abortable): AsyncTask<void> => {
        return this.#store.delete(key, abortable);
      });

  }

  clear(
    abortable: Abortable,
  ): AsyncTask<void> {
    return this.#store.clear(abortable);
  }

  keys(
    abortable: Abortable,
  ): AsyncTask<InferAsyncStoreEntryGKey<GEntry>[]> {
    return AsyncTask.error(
      new Error(`Cannot read keys of an HashedKeyAsyncStore.`),
      abortable,
    );
  }

  values(
    abortable: Abortable,
  ): AsyncTask<InferAsyncStoreEntryGValue<GEntry>[]> {
    return this.#store.values(abortable);
  }

  entries(
    abortable: Abortable,
  ): AsyncTask<GEntry[]> {
    return AsyncTask.error(
      new Error(`Cannot read entries of an HashedKeyAsyncStore.`),
      abortable,
    );
  }
}

// const a = new HashedKeyAsyncStore<[boolean, Uint8Array]>({
//   store: await IDBAsyncStore.open<[string, Uint8Array]>({
//     abortable: Abortable.never,
//   }),
// });

