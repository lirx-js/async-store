import { Abortable, AsyncTask, IAsyncTaskFactory } from '@lirx/async-task';
import { IAsyncStore } from '../../async-store.type';
import { IAsyncStoreEntry } from '../../traits/entries/async-store.entries.function-definition';
import { decryptDataUsingPassword } from './helpers/decrypt-data-using-password';
import { encryptDataUsingPassword } from './helpers/encrypt-data-using-password';

export interface IPasswordEncryptedAsyncStoreOptions {
  readonly store: IAsyncStore;
  readonly password: string;
}

export class PasswordEncryptedAsyncStore implements IAsyncStore {
  readonly #store: IAsyncStore;
  readonly #password: string;

  constructor(
    {
      store,
      password,
    }: IPasswordEncryptedAsyncStoreOptions,
  ) {
    this.#store = store;
    this.#password = password;
  }

  get(
    key: string,
    abortable: Abortable,
  ): AsyncTask<any> {
    return this.#store.get(key, abortable)
      .successful((encrypted: Uint8Array): AsyncTask<any> => {
        return decryptDataUsingPassword({
          password: this.#password,
          encrypted,
          abortable,
        });
      });
  }

  set(
    key: string,
    value: any,
    abortable: Abortable,
  ): AsyncTask<void> {
    return encryptDataUsingPassword({
      password: this.#password,
      data: value,
      abortable,
    })
      .successful((encrypted: Uint8Array): AsyncTask<void> => {
        return this.#store.set(key, encrypted, abortable);
      });
  }

  delete(
    key: string,
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
  ): AsyncTask<string[]> {
    return this.#store.keys(abortable);
  }

  values(
    abortable: Abortable,
  ): AsyncTask<any[]> {
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
  ): AsyncTask<IAsyncStoreEntry[]> {
    return this.#store.entries(abortable)
      .successful((entries: IAsyncStoreEntry[], abortable: Abortable): AsyncTask<IAsyncStoreEntry[]> => {
        return AsyncTask.all(
          entries.map(([key, encrypted]: [string, Uint8Array]): IAsyncTaskFactory<IAsyncStoreEntry> => {
            return (abortable: Abortable): AsyncTask<IAsyncStoreEntry> => {
              return decryptDataUsingPassword({
                password: this.#password,
                encrypted,
                abortable,
              })
                .successful((value: any): IAsyncStoreEntry => {
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




