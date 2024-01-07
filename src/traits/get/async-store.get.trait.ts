import { IAsyncStoreGetFunction } from './async-store.get.function-definition';

export interface IAsyncStoreGetTrait {
  readonly get: IAsyncStoreGetFunction;
}
