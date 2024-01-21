import { Abortable, AsyncTask } from '@lirx/async-task';
import { IGenericAsyncStoreEntry } from '../../types/async-store-entry.type';

export interface IAsyncStoreEntriesFunction<GEntry extends IGenericAsyncStoreEntry> {
  (
    abortable: Abortable,
  ): AsyncTask<GEntry[]>;
}

