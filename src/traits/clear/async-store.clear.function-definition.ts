import { Abortable, AsyncTask } from '@lirx/async-task';

export interface IAsyncStoreClearFunction {
  (
    abortable: Abortable,
  ): AsyncTask<void>;
}

