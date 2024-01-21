import { Abortable, AsyncTask } from '@lirx/async-task';
import { IGenericAsyncStoreEntry, InferAsyncStoreEntryGKey } from '../../types/async-store-entry.type';

export interface IAsyncStoreKeysFunction<GEntry extends IGenericAsyncStoreEntry> {
  (
    abortable: Abortable,
  ): AsyncTask<InferAsyncStoreEntryGKey<GEntry>[]>;
}

