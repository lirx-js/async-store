import { Abortable, AsyncTask, IAsyncTaskFactory, IAsyncTaskInput } from '@lirx/async-task';
import { IAsyncStore } from '../../async-store.type';
import { IAsyncStoreGetFunctionReturnedValue } from '../../traits/get/async-store.get.function-definition';
import { IAsyncStoreSetFunctionValue } from '../../traits/set/async-store.set.function-definition';
import {
  IAsyncStoreEntry,
  IGenericAsyncStoreEntry,
  InferAsyncStoreEntryGKey,
  InferAsyncStoreEntryGValue,
} from '../../types/async-store-entry.type';
import { decryptDataUsingPassword } from './helpers/decrypt-data-using-password';
import { encryptDataUsingPassword } from './helpers/encrypt-data-using-password';

export type IPasswordEncryptedAsyncStoreSubStoreEntry<GEntry extends IGenericAsyncStoreEntry> =
  IAsyncStoreEntry<InferAsyncStoreEntryGKey<GEntry>, Uint8Array>
// GEntry extends IAsyncStoreEntry<infer GKey, any>
//   ? IAsyncStoreEntry<GKey, Uint8Array>
//   : any
  ;

export type IPasswordEncryptedAsyncStoreSubStore<GEntry extends IGenericAsyncStoreEntry> =
  IAsyncStore<IPasswordEncryptedAsyncStoreSubStoreEntry<GEntry>>
  ;

export interface IPasswordEncryptedAsyncStoreOptions<GEntry extends IGenericAsyncStoreEntry> {
  readonly store: IPasswordEncryptedAsyncStoreSubStore<GEntry>;
  readonly password: string;
}

export class PasswordEncryptedAsyncStore<GEntry extends IGenericAsyncStoreEntry> implements IAsyncStore<GEntry> {
  readonly #store: IPasswordEncryptedAsyncStoreSubStore<GEntry>;
  readonly #password: string;

  constructor(
    {
      store,
      password,
    }: IPasswordEncryptedAsyncStoreOptions<GEntry>,
  ) {
    this.#store = store;
    this.#password = password;
  }

  get<GKey extends InferAsyncStoreEntryGKey<GEntry>>(
    key: GKey,
    abortable: Abortable,
  ): AsyncTask<IAsyncStoreGetFunctionReturnedValue<GEntry, GKey>> {
    return this.#store.get(key, abortable)
      .successful((encrypted: Uint8Array | undefined): IAsyncTaskInput<any> => {
        if (encrypted === void 0) {
          return void 0;
        } else {
          return decryptDataUsingPassword({
            password: this.#password,
            encrypted,
            abortable,
          });
        }
      });
  }

  set<GKey extends InferAsyncStoreEntryGKey<GEntry>>(
    key: GKey,
    value: IAsyncStoreSetFunctionValue<GEntry, GKey>,
    abortable: Abortable,
  ): AsyncTask<void> {
    return encryptDataUsingPassword({
      password: this.#password,
      data: value,
      abortable,
    })
      .successful((encrypted: Uint8Array): AsyncTask<void> => {
        return this.#store.set<any>(key, encrypted, abortable);
      });
  }

  delete(
    key: InferAsyncStoreEntryGKey<GEntry>,
    abortable: Abortable,
  ): AsyncTask<void> {
    return this.#store.delete(key, abortable);
  }

  clear(
    abortable: Abortable,
  ): AsyncTask<void> {
    return this.#store.clear(abortable);
  }

  keys(
    abortable: Abortable,
  ): AsyncTask<InferAsyncStoreEntryGKey<GEntry>[]> {
    return this.#store.keys(abortable);
  }

  values(
    abortable: Abortable,
  ): AsyncTask<InferAsyncStoreEntryGValue<GEntry>[]> {
    return this.#store.values(abortable)
      .successful((values: Uint8Array[], abortable: Abortable): AsyncTask<any[]> => {
        return AsyncTask.all(
          values.map((encrypted: Uint8Array): IAsyncTaskFactory<any> => {
            return (abortable: Abortable): AsyncTask<any> => {
              return decryptDataUsingPassword({
                password: this.#password,
                encrypted,
                abortable,
              });
            };
          }),
          abortable,
        );
      });
  }

  entries(
    abortable: Abortable,
  ): AsyncTask<GEntry[]> {
    return this.#store.entries(abortable)
      .successful((entries: IPasswordEncryptedAsyncStoreSubStoreEntry<GEntry>[], abortable: Abortable): AsyncTask<GEntry[]> => {
        return AsyncTask.all(
          entries.map(([key, encrypted]: IPasswordEncryptedAsyncStoreSubStoreEntry<GEntry>): IAsyncTaskFactory<any> => {
            return (abortable: Abortable): AsyncTask<any> => {
              return decryptDataUsingPassword({
                password: this.#password,
                encrypted,
                abortable,
              })
                .successful((value: any): any => {
                  return [
                    key,
                    value,
                  ];
                });
            };
          }),
          abortable,
        );
      });
  }
}

// const a = new PasswordEncryptedAsyncStore<[string, boolean]>({
//   password: 'anc',
//   store: await IDBAsyncStore.open<[string, Uint8Array]>({
//     abortable: Abortable.never,
//   }),
// });

