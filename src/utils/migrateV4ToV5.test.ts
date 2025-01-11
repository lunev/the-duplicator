import {
  migrateParams,
  migratePreferences,
  cleanUpOldKeys,
  migrate,
} from './migrateV4ToV5';
import { updateAllParams } from '@/features/params/params-slice';
import { setPreference } from '@/features/preferences/preferences-slice';
import { waitFor } from '@test-utils';

const STORAGE_KEYS = {
  MIGRATION_TO_V5: 'migrationToV5',
  DATA_V4: 'channels',
  PREFERENCES_V4: 'userPreferences',
  MIGRATION_COMPLETED: 'migrationCompleted',
};

afterEach(() => {
  chrome.storage.sync.clear();
});

describe('Migration from v4 to v5', () => {
  it('should migrate parameters correctly', async () => {
    const oldParamsData = ['/admin/', '/wp-admin/'];
    chrome.storage.sync.set({
      [STORAGE_KEYS.DATA_V4]: oldParamsData,
    });

    const mockDispatch = vi.fn();
    await migrateParams(mockDispatch);

    const expectedUpdatedParamsData = oldParamsData.map((item) => ({
      id: expect.any(String),
      title: item,
    }));

    expect(mockDispatch).toHaveBeenCalledWith(
      updateAllParams(expectedUpdatedParamsData),
    );
  });

  it('should migrate preferences correctly', async () => {
    chrome.storage.sync.set({
      [STORAGE_KEYS.PREFERENCES_V4]: { mode: 'default', openNewTab: false },
    });

    const mockDispatch = vi.fn();
    await migratePreferences(mockDispatch);

    // expected mode preferences have been migrated correctly
    expect(mockDispatch).toHaveBeenCalledWith(
      setPreference({ property: 'basicMode', value: false }),
    );

    // expected newTab preferences have been migrated correctly
    expect(mockDispatch).toHaveBeenCalledWith(
      setPreference({ property: 'newTab', value: false }),
    );
  });
  it('should only perform migration if MIGRATION_TO_V5 flag is set', async () => {
    chrome.storage.sync.set({
      [STORAGE_KEYS.MIGRATION_TO_V5]: true,
      [STORAGE_KEYS.DATA_V4]: ['/admin/', '/wp-admin/'],
    });

    const mockDispatch = vi.fn();
    await migrate(mockDispatch);

    await waitFor(async () => {
      expect(chrome.storage.sync.remove).toHaveBeenCalled();
    });
  });
});

describe('cleanUpOldKeys', () => {
  it('should remove old storage keys', async () => {
    cleanUpOldKeys();
    expect(chrome.storage.sync.remove).toHaveBeenCalledWith([
      STORAGE_KEYS.MIGRATION_TO_V5,
      STORAGE_KEYS.DATA_V4,
      STORAGE_KEYS.PREFERENCES_V4,
      STORAGE_KEYS.MIGRATION_COMPLETED,
    ]);
  });
});
