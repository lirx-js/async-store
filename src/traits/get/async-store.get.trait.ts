import { IGenericAsyncStoreEntry } from '../../types/async-store-entry.type';
import { IAsyncStoreGetFunction } from './async-store.get.function-definition';

export interface IAsyncStoreGetTrait<GEntry extends IGenericAsyncStoreEntry> {
  readonly get: IAsyncStoreGetFunction<GEntry>;
}
