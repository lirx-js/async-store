import { Abortable, AsyncTask } from '@lirx/async-task';

export interface IAsyncStoreDeleteFunction {
  (
    key: string,
    abortable: Abortable,
  ): AsyncTask<void>;
}

