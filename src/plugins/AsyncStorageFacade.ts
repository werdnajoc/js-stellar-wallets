import { AsyncStorageStatic } from "@react-native-async-storage/async-storage";
import { EncryptedKey } from "../types";

export interface AsyncStorageConfigParams {
  prefix?: string;
  storage: AsyncStorageStatic;
}

/**
 * Facade for `LocalStorageKeyStore` encapsulating the access to the actual
 * local storage
 */
export class AsyncStorageFacade {
  private storage: AsyncStorageStatic | null;
  private prefix: string;

  constructor() {
    this.storage = null;
    this.prefix = "stellarkeys";
  }

  public configure(params: AsyncStorageConfigParams) {
    Object.assign(this, params);
  }

  public hasKey(id: string) {
    this.check();
    return this.storage !== null
      ? this.storage.getItem(`${this.prefix}:${id}`) !== null
      : null;
  }

  public async getKey(id: string) {
    this.check();
    const item =
      this.storage !== null
        ? await this.storage.getItem(`${this.prefix}:${id}`)
        : null;

    return item ? JSON.parse(item) : null;
  }

  public setKey(id: string, key: EncryptedKey) {
    this.check();
    return this.storage !== null
      ? this.storage.setItem(`${this.prefix}:${id}`, JSON.stringify({ ...key }))
      : null;
  }

  public removeKey(id: string) {
    this.check();
    return this.storage !== null
      ? this.storage.removeItem(`${this.prefix}:${id}`)
      : null;
  }

  public async getAllKeys() {
    this.check();
    /*
    const regexp = RegExp(`^${this.prefix}\\:(.*)`);
    const keys: EncryptedKey[] = [];

    if (this.storage !== null) {
      for (let i = 0; i < this.storage.length; i++) {
        const raw_id = this.storage.key(i);
        if (raw_id !== null && regexp.test(raw_id)) {
          const key = this.getKey(regexp.exec(raw_id)![1]);
          if (key !== null) {
            keys.push(key);
          }
        }
      }
    }
     */
    // return keys;
    return [];
  }

  private check() {
    if (this.storage === null) {
      throw new Error("A storage object must have been set");
    }
    if (this.prefix === "") {
      throw new Error("A non-empty prefix must have been set");
    }
    return this.storage !== null && this.prefix !== "";
  }
}
