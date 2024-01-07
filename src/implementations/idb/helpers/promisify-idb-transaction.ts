import { Abortable, AsyncTask, IAsyncTaskErrorFunction, IAsyncTaskSuccessFunction } from '@lirx/async-task';
import { mergeUnsubscribeFunctions } from '@lirx/unsubscribe';
import { createEventListener } from '@lirx/utils';

export function promisifyIDBTransaction(
  transaction: IDBTransaction,
  abortable: Abortable,
): AsyncTask<void> {
  return new AsyncTask<void>(
    (
      success: IAsyncTaskSuccessFunction<void>,
      error: IAsyncTaskErrorFunction,
      abortable: Abortable,
    ): void => {
      const end = mergeUnsubscribeFunctions([
        createEventListener(transaction, 'complete', (): void => {
          end();
          success();
        }),
        createEventListener(transaction, 'error', (): void => {
          end();
          error(transaction.error);
        }),
        createEventListener(transaction, 'abort', (): void => {
          end();
          error(transaction.error);
        }),
        abortable.onAbort((): void => {
          end();
          transaction.abort();
        }),
      ]);
    },
    abortable,
  );
}
