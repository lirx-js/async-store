export type IAsyncStoreEntry<GKey, GValue> = readonly [
  key: GKey,
  value: GValue,
];

export type IGenericAsyncStoreEntry = IAsyncStoreEntry<any, any>;

/* INFER */

export type InferAsyncStoreEntryGKey<GEntry extends IGenericAsyncStoreEntry> =
  GEntry extends IAsyncStoreEntry<infer GKey, any>
    ? GKey
    : never
  ;

export type InferAsyncStoreEntryGValue<GEntry extends IGenericAsyncStoreEntry> =
  GEntry extends IAsyncStoreEntry<any, infer GValue>
    ? GValue
    : never
  ;

export type InferAsyncStoreEntryGValueFromKey<GEntry extends IGenericAsyncStoreEntry, GKey> =
  GEntry extends IAsyncStoreEntry<GKey, infer GValue>
    ? GValue
    : never
  ;
