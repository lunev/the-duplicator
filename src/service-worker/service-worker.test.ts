import { STORAGE_KEYS } from '@/constants';
import './service-worker';

describe('Service Worker: onInstalled listener', () => {
  it('sets migrationToV5 and updates available if previous version is 4.0.0', () => {
    const mockCallback = vi.fn();
    chrome.runtime.onInstalled.addListener(mockCallback);

    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      migrationToV5: true,
    });

    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      [STORAGE_KEYS.UPDATES_AVAILABLE]: true,
    });
  });
});
