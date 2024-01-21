import { Abortable, AsyncTask } from '@lirx/async-task';
import { IGenericAsyncStoreEntry, InferAsyncStoreEntryGValue } from '../../types/async-store-entry.type';

export interface IAsyncStoreValuesFunction<GEntry extends IGenericAsyncStoreEntry> {
  (
    abortable: Abortable,
  ): AsyncTask<InferAsyncStoreEntryGValue<GEntry>[]>;
}

