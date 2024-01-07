import { Abortable, AsyncTask } from '@lirx/async-task';
import {
  createPasswordCryptoKeyForEncryption,
  ICreatePasswordCryptoKeyForEncryptionOptions,
} from './create-password-crypto-key-for-encryption';

export interface IDecryptDataUsingPasswordOptions extends Omit<ICreatePasswordCryptoKeyForEncryptionOptions, 'salt' | 'keyUsages'> {
  readonly encrypted: Uint8Array;
}

export function decryptDataUsingPassword(
  {
    encrypted,
    ...options
  }: IDecryptDataUsingPasswordOptions,
): AsyncTask<any> {
  const salt: Uint8Array = encrypted.slice(0, 16);
  const iv: Uint8Array = encrypted.slice(16, 16 + 12);
  const data: Uint8Array = encrypted.slice(16 + 12);

  return createPasswordCryptoKeyForEncryption({
    ...options,
    salt,
    keyUsages: ['decrypt'],
  })
    .successful((key: CryptoKey, abortable: Abortable) => {
      return AsyncTask.fromFactory(() => {
        return crypto.subtle.decrypt(
          {
            name: 'AES-GCM',
            iv,
          },
          key,
          data,
        );
      }, abortable);
    })
    .successful((buffer: ArrayBuffer): any => {
      return JSON.parse(new TextDecoder().decode(buffer));
    });
}
