import { Abortable, AsyncTask, IAsyncTaskConstraint, IAsyncTaskErrorFunction, IAsyncTaskSuccessFunction } from '@lirx/async-task';
import { mergeUnsubscribeFunctions } from '@lirx/unsubscribe';
import { createEventListener } from '@lirx/utils';

export function promisifyIDBRequest<GValue extends IAsyncTaskConstraint<GValue>>(
  request: IDBRequest<GValue>,
  abortable: Abortable,
): AsyncTask<GValue> {
  return new AsyncTask<GValue>(
    (
      success: IAsyncTaskSuccessFunction<GValue>,
      error: IAsyncTaskErrorFunction,
      abortable: Abortable,
    ): void => {
      if (request.readyState === 'done') {
        if (request.error === null) {
          success(request.result);
        } else {
          error(request.error);
        }
      } else {
        const end = mergeUnsubscribeFunctions([
          createEventListener(request, 'success', (): void => {
            end();
            success(request.result);
          }),
          createEventListener(request, 'error', (): void => {
            end();
            error(request.error);
          }),
          abortable.onAbort((): void => {
            end();
          }),
        ]);
      }
    },
    abortable,
  );
}
