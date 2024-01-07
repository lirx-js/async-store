import { AsyncTask, IAbortableOptions } from '@lirx/async-task';

export interface IDerivePasswordCryptoKeyOptions extends IAbortableOptions {
  readonly key: CryptoKey;
  readonly salt: Uint8Array;
  readonly keyUsages?: Extract<KeyUsage, 'encrypt' | 'decrypt'>[];
}

export function derivePasswordCryptoKey(
  {
    key,
    salt,
    keyUsages = ['encrypt', 'decrypt'],
    abortable,
  }: IDerivePasswordCryptoKeyOptions,
): AsyncTask<CryptoKey> {
  return AsyncTask.fromFactory(() => {
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      key,
      {
        name: 'AES-GCM',
        length: 256,
      },
      false,
      keyUsages,
    );
  }, abortable);
}
