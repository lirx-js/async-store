import { Abortable, AsyncTask } from '@lirx/async-task';

export interface IAsyncStoreGetFunction {
  (
    key: string,
    abortable: Abortable,
  ): AsyncTask<any>;
}

