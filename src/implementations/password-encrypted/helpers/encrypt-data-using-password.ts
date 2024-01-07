import { Abortable, AsyncTask } from '@lirx/async-task';
import {
  createPasswordCryptoKeyForEncryption,
  ICreatePasswordCryptoKeyForEncryptionOptions,
} from './create-password-crypto-key-for-encryption';

export interface IEncryptDataUsingPasswordOptions extends Omit<ICreatePasswordCryptoKeyForEncryptionOptions, 'salt' | 'keyUsages'> {
  readonly data: any,
}

export function encryptDataUsingPassword(
  {
    data,
    ...options
  }: IEncryptDataUsingPasswordOptions,
): AsyncTask<Uint8Array> {
  const salt: Uint8Array = crypto.getRandomValues(new Uint8Array(16));
  const iv: Uint8Array = crypto.getRandomValues(new Uint8Array(12));

  return createPasswordCryptoKeyForEncryption({
    ...options,
    salt,
    keyUsages: ['encrypt'],
  })
    .successful((key: CryptoKey, abortable: Abortable) => {
      return AsyncTask.fromFactory(() => {
        return crypto.subtle.encrypt(
          {
            name: 'AES-GCM',
            iv,
          },
          key,
          new TextEncoder().encode(
            JSON.stringify(data),
          ),
        );
      }, abortable);
    })
    .successful((buffer: ArrayBuffer) => {
      const data: Uint8Array = new Uint8Array(buffer);

      const encrypted: Uint8Array = new Uint8Array(
        salt.byteLength + iv.byteLength + data.byteLength,
      );

      encrypted.set(salt, 0);
      encrypted.set(iv, salt.byteLength);
      encrypted.set(data, salt.byteLength + iv.byteLength);

      return encrypted;
    });
}
