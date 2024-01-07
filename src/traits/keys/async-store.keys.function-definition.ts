import { Abortable, AsyncTask } from '@lirx/async-task';

export interface IAsyncStoreKeysFunction {
  (
    abortable: Abortable,
  ): AsyncTask<string[]>;
}

