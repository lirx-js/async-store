import { Abortable, AsyncTask } from '@lirx/async-task';
import { IAsyncStoreEntry, IGenericAsyncStoreEntry, InferAsyncStoreEntryGKey } from '../../types/async-store-entry.type';

export type IAsyncStoreSetFunctionValue<GEntry extends IGenericAsyncStoreEntry, GKey> =
  GEntry extends IAsyncStoreEntry<GKey, infer GValue>
    ? GValue
    : never
  ;

export interface IAsyncStoreSetFunction<GEntry extends IGenericAsyncStoreEntry> {
  <GKey extends InferAsyncStoreEntryGKey<GEntry>>(
    key: GKey,
    value: IAsyncStoreSetFunctionValue<GEntry, GKey>,
    abortable: Abortable,
  ): AsyncTask<void>;
}

