import { IAsyncStoreDeleteFunction } from './async-store.delete.function-definition';

export interface IAsyncStoreDeleteTrait {
  readonly delete: IAsyncStoreDeleteFunction;
}
