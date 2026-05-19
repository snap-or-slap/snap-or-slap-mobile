const memoryStorage = new Map<string, string>();

/**
 * TODO: Replace this in-memory fallback with AsyncStorage once persistence is
 * available in the app dependencies.
 */
export const storage = {
  getItem: async (key: string): Promise<string | null> => memoryStorage.get(key) ?? null,
  setItem: async (key: string, value: string): Promise<void> => {
    memoryStorage.set(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    memoryStorage.delete(key);
  },
};
