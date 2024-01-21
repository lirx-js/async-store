import { IGenericAsyncStoreEntry } from '../../types/async-store-entry.type';
import { IAsyncStoreDeleteFunction } from './async-store.delete.function-definition';

export interface IAsyncStoreDeleteTrait<GEntry extends IGenericAsyncStoreEntry> {
  readonly delete: IAsyncStoreDeleteFunction<GEntry>;
}
