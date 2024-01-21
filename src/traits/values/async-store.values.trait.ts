import { IGenericAsyncStoreEntry } from '../../types/async-store-entry.type';
import { IAsyncStoreValuesFunction } from './async-store.values.function-definition';

export interface IAsyncStoreValuesTrait<GEntry extends IGenericAsyncStoreEntry> {
  readonly values: IAsyncStoreValuesFunction<GEntry>;
}
