import { IAsyncStoreClearTrait } from './traits/clear/async-store.clear.trait';
import { IAsyncStoreDeleteTrait } from './traits/delete/async-store.delete.trait';
import { IAsyncStoreEntriesTrait } from './traits/entries/async-store.entries.trait';
import { IAsyncStoreGetTrait } from './traits/get/async-store.get.trait';
import { IAsyncStoreKeysTrait } from './traits/keys/async-store.keys.trait';
import { IAsyncStoreSetTrait } from './traits/set/async-store.set.trait';
import { IAsyncStoreValuesTrait } from './traits/values/async-store.values.trait';
import { IGenericAsyncStoreEntry } from './types/async-store-entry.type';

export interface IAsyncStore<GEntry extends IGenericAsyncStoreEntry> extends //
  IAsyncStoreGetTrait<GEntry>,
  IAsyncStoreSetTrait<GEntry>,
  IAsyncStoreDeleteTrait<GEntry>,
  IAsyncStoreClearTrait,
  IAsyncStoreKeysTrait<GEntry>,
  IAsyncStoreValuesTrait<GEntry>,
  IAsyncStoreEntriesTrait<GEntry>
//
{
}

export type IGenericAsyncStore = IAsyncStore<IGenericAsyncStoreEntry>;



