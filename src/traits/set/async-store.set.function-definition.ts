import { Abortable, AsyncTask } from '@lirx/async-task';

export interface IAsyncStoreSetFunction {
  (
    key: string,
    value: any,
    abortable: Abortable,
  ): AsyncTask<void>;
}

