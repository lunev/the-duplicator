import { STORAGE_KEYS } from '@/constants';

export const storagePersisted = {
  get: async (key: string) => {
    const data = await chrome.storage.sync.get([STORAGE_KEYS.STORAGE_KEY_ROOT]);
    const rootData = data && data[STORAGE_KEYS.STORAGE_KEY_ROOT];
    if (data && rootData) {
      try {
        const storage = JSON.parse(rootData);
        return JSON.parse(storage[key]);
      } catch (parseError) {
        console.log('Error parsing stored data:', parseError);
      }
    } else {
      console.log('No data found for the key:', key);
    }
  },
};
