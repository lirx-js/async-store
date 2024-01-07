import { Abortable, AsyncTask } from '@lirx/async-task';

export type IAsyncStoreEntry = [string, any];

export interface IAsyncStoreEntriesFunction {
  (
    abortable: Abortable,
  ): AsyncTask<IAsyncStoreEntry[]>;
}

