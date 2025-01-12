import {
  migrateParams,
  migratePreferences,
  cleanUpOldKeys,
  migrate,
} from './migrateV4ToV5';
import * as migrateTools from './migrateV4ToV5';
import { updateAllParams } from '@/features/params/params-slice';
import { setPreference } from '@/features/preferences/preferences-slice';

const STORAGE_KEYS = {
  MIGRATION_TO_V5: 'migrationToV5',
  DATA_V4: 'channels',
  PREFERENCES_V4: 'userPreferences',
  MIGRATION_COMPLETED: 'migrationCompleted',
};

describe('Migration from v4 to v5', () => {
  it('should migrate parameters correctly', async () => {
    vi.spyOn(chrome.storage.sync, 'get').mockImplementation(() => {
      return Promise.resolve({ [STORAGE_KEYS.DATA_V4]: ['/admin/', '/user/'] });
    });

    const mockDispatch = vi.fn();
    await migrateParams(mockDispatch);

    expect(mockDispatch).toHaveBeenCalledWith(
      updateAllParams([
        { id: expect.any(String), title: '/admin/' },
        { id: expect.any(String), title: '/user/' },
      ]),
    );
  });

  it('should migrate preferences correctly', async () => {
    vi.spyOn(chrome.storage.sync, 'get').mockImplementation(() => {
      return Promise.resolve({
        [STORAGE_KEYS.PREFERENCES_V4]: { mode: 'default', openNewTab: false },
      });
    });

    const mockDispatch = vi.fn();
    await migratePreferences(mockDispatch);

    expect(mockDispatch).toHaveBeenCalledWith(
      setPreference({ property: 'basicMode', value: false }),
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      setPreference({ property: 'newTab', value: false }),
    );
  });

  it('should only perform migration if MIGRATION_TO_V5 flag is set', async () => {
    vi.spyOn(chrome.storage.sync, 'get').mockImplementation(() => {
      return Promise.resolve({
        [STORAGE_KEYS.MIGRATION_TO_V5]: true,
        [STORAGE_KEYS.DATA_V4]: ['/admin/', '/user/'],
      });
    });

    const migrateSpy = vi.spyOn(migrateTools, 'migrate');

    const mockDispatch = vi.fn();
    await migrate(mockDispatch);

    expect(migrateSpy).toHaveBeenCalled();
  });
});
describe('cleanUpOldKeys', () => {
  it('should remove old storage keys', async () => {
    await cleanUpOldKeys();
    expect(chrome.storage.sync.remove).toHaveBeenCalledWith([
      STORAGE_KEYS.MIGRATION_TO_V5,
      STORAGE_KEYS.DATA_V4,
      STORAGE_KEYS.PREFERENCES_V4,
      STORAGE_KEYS.MIGRATION_COMPLETED,
    ]);
  });
});
