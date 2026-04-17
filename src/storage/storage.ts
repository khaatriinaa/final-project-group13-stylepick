// src/storage/storage.ts
// Low-level typed wrappers around AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';

export const Storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`AsyncStorage set error [${key}]:`, e);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error(`AsyncStorage remove error [${key}]:`, e);
    }
  },

  async getList<T>(key: string): Promise<T[]> {
    const result = await Storage.get<T[]>(key);
    return result ?? [];
  },
};
