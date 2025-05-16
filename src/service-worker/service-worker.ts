import { STORAGE_KEYS } from '@/constants';

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'update') {
    chrome.storage.sync.set({
      [STORAGE_KEYS.UPDATES_AVAILABLE]: true,
    });
  }
});
