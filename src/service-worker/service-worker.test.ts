import { STORAGE_KEYS } from '@/constants';

describe('service-worker', () => {
  it('should handle update from version 4.0.0', async () => {
    const onInstalledCallback = vi.fn();
    vi.spyOn(chrome.runtime.onInstalled, 'addListener').mockImplementation(
      onInstalledCallback,
    );

    await import('./service-worker');

    expect(chrome.runtime.onInstalled.addListener).toHaveBeenCalledWith(
      expect.any(Function),
    );

    const details = { reason: 'update', previousVersion: '4.0.0' };
    const registeredListener = onInstalledCallback.mock.calls[0][0];
    registeredListener(details);

    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      migrationToV5: true,
    });
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      [STORAGE_KEYS.UPDATES_AVAILABLE]: true,
    });
  });

  it('should not set migrationToV5 for other versions', async () => {
    const onInstalledCallback = vi.fn();
    vi.spyOn(chrome.runtime.onInstalled, 'addListener').mockImplementation(
      onInstalledCallback,
    );

    await import('./service-worker');

    const details = { reason: 'update', previousVersion: '5.0.0' };
    const registeredListener = onInstalledCallback.mock.calls[0][0];
    registeredListener(details);

    expect(chrome.storage.sync.set).not.toHaveBeenCalledWith({
      migrationToV5: true,
    });
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      [STORAGE_KEYS.UPDATES_AVAILABLE]: true,
    });
  });

  it('should not trigger for non-update reasons', async () => {
    const onInstalledCallback = vi.fn();
    vi.spyOn(chrome.runtime.onInstalled, 'addListener').mockImplementation(
      onInstalledCallback,
    );

    await import('./service-worker');

    const details = { reason: 'install' };
    const registeredListener = onInstalledCallback.mock.calls[0][0];
    registeredListener(details);

    expect(chrome.storage.sync.set).not.toHaveBeenCalled();
  });
});
