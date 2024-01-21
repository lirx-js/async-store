import { Abortable, AsyncTask } from '@lirx/async-task';
import { IGenericAsyncStoreEntry, InferAsyncStoreEntryGKey } from '../../types/async-store-entry.type';

export interface IAsyncStoreDeleteFunction<GEntry extends IGenericAsyncStoreEntry> {
  (
    key: InferAsyncStoreEntryGKey<GEntry>,
    abortable: Abortable,
  ): AsyncTask<void>;
}

