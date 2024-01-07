import { AsyncTask, IAbortableOptions } from '@lirx/async-task';

export interface ICreatePasswordCryptoKeyOptions extends IAbortableOptions {
  readonly password: string;
}

export function createPasswordCryptoKey(
  {
    password,
    abortable,
  }: ICreatePasswordCryptoKeyOptions,
): AsyncTask<CryptoKey> {
  return AsyncTask.fromFactory(() => {
    return crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveKey'],
    );
  }, abortable);
}
