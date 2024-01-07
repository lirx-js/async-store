import { Abortable, AsyncTask } from '@lirx/async-task';

export interface IAsyncStoreValuesFunction {
  (
    abortable: Abortable,
  ): AsyncTask<any[]>;
}

