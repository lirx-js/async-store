import { Abortable, AsyncTask, IEnsureAsyncTaskConstrained } from '@lirx/async-task';
import { IAsyncStoreEntry, IGenericAsyncStoreEntry, InferAsyncStoreEntryGKey } from '../../types/async-store-entry.type';

export type IAsyncStoreGetFunctionReturnedValue<GEntry extends IGenericAsyncStoreEntry, GKey> = IEnsureAsyncTaskConstrained<
  GEntry extends IAsyncStoreEntry<GKey, infer GValue>
    ? (GValue | undefined)
    : never
>;

export interface IAsyncStoreGetFunction<GEntry extends IGenericAsyncStoreEntry> {
  <GKey extends InferAsyncStoreEntryGKey<GEntry>>(
    key: GKey,
    abortable: Abortable,
  ): AsyncTask<IAsyncStoreGetFunctionReturnedValue<GEntry, GKey>>;
}

