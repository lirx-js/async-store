import { IAsyncStoreEntriesFunction } from './async-store.entries.function-definition';

export interface IAsyncStoreEntriesTrait {
  readonly entries: IAsyncStoreEntriesFunction;
}
