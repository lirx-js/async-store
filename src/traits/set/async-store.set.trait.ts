import { IGenericAsyncStoreEntry } from '../../types/async-store-entry.type';
import { IAsyncStoreSetFunction } from './async-store.set.function-definition';

export interface IAsyncStoreSetTrait<GEntry extends IGenericAsyncStoreEntry> {
  readonly set: IAsyncStoreSetFunction<GEntry>;
}
