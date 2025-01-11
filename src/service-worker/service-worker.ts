import { STORAGE_KEYS } from '@/constants';

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'update') {
    if (details.previousVersion === '4.0.0') {
      chrome.storage.sync.set({ migrationToV5: true });
    }

    chrome.storage.sync.set({
      [STORAGE_KEYS.UPDATES_AVAILABLE]: true,
    });
  }
});
