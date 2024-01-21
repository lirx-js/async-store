import { IGenericAsyncStoreEntry } from '../../types/async-store-entry.type';
import { IAsyncStoreKeysFunction } from './async-store.keys.function-definition';

export interface IAsyncStoreKeysTrait<GEntry extends IGenericAsyncStoreEntry> {
  readonly keys: IAsyncStoreKeysFunction<GEntry>;
}
