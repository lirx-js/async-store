export type IIDBAsyncStoreEntry<GKey extends IDBValidKey, GValue> = readonly [
  key: GKey,
  value: GValue,
];

export type IGenericIDBAsyncStoreEntry = IIDBAsyncStoreEntry<any, any>;
