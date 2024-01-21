import { IGenericAsyncStoreEntry } from '../../types/async-store-entry.type';
import { IAsyncStoreEntriesFunction } from './async-store.entries.function-definition';

export interface IAsyncStoreEntriesTrait<GEntry extends IGenericAsyncStoreEntry> {
  readonly entries: IAsyncStoreEntriesFunction<GEntry>;
}
