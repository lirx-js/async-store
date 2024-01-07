import { Abortable, AsyncTask } from '@lirx/async-task';
import { createPasswordCryptoKey, ICreatePasswordCryptoKeyOptions } from './create-password-crypto-key';
import { derivePasswordCryptoKey, IDerivePasswordCryptoKeyOptions } from './derive-password-crypto-key';

export interface ICreatePasswordCryptoKeyForEncryptionOptions extends ICreatePasswordCryptoKeyOptions, Omit<IDerivePasswordCryptoKeyOptions, 'key'> {
}

export function createPasswordCryptoKeyForEncryption(
  options: ICreatePasswordCryptoKeyForEncryptionOptions,
): AsyncTask<CryptoKey> {
  return createPasswordCryptoKey(options)
    .successful((key: CryptoKey, abortable: Abortable): AsyncTask<CryptoKey> => {
      return derivePasswordCryptoKey({
        ...options,
        key,
        abortable,
      });
    });
}
