/*
 Migration from v4 to v5:
- Removed Material-UI (MUI) for styling.
- Introduced Redux and Redux-Persist for state management.
This migration ensures that user preferences and parameter data from v4 are converted to work with the new structure in v5.
*/

import { AppDispatch } from '@/app/store';
import { updateAllParams } from '@/features/params/params-slice';
import { setPreference } from '@/features/preferences/preferences-slice';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  MIGRATION_TO_V5: 'migrationToV5',
  DATA_V4: 'channels',
  PREFERENCES_V4: 'userPreferences',
  MIGRATION_COMPLETED: 'migrationCompleted',
};

export const migrateParams = async (dispatch: AppDispatch) => {
  const result = await chrome.storage.sync.get(STORAGE_KEYS.DATA_V4);
  const oldParamsData = result[STORAGE_KEYS.DATA_V4];

  if (oldParamsData?.length > 0) {
    const updatedParamsData = oldParamsData.map((item: string) => ({
      id: uuidv4(),
      title: item,
    }));
    dispatch(updateAllParams(updatedParamsData));
  }
};

export const migratePreferences = async (dispatch: AppDispatch) => {
  const result = await chrome.storage.sync.get(STORAGE_KEYS.PREFERENCES_V4);
  const oldPreferencesData = result[STORAGE_KEYS.PREFERENCES_V4];

  if (oldPreferencesData) {
    const { mode, openNewTab } = oldPreferencesData;
    dispatch(
      setPreference({
        property: 'basicMode',
        value: mode === 'basic',
      }),
    );
    dispatch(
      setPreference({
        property: 'newTab',
        value: openNewTab,
      }),
    );
  }
};

export const cleanUpOldKeys = async () => {
  await chrome.storage.sync.remove([
    STORAGE_KEYS.MIGRATION_TO_V5,
    STORAGE_KEYS.DATA_V4,
    STORAGE_KEYS.PREFERENCES_V4,
    STORAGE_KEYS.MIGRATION_COMPLETED,
  ]);
};

export const migrate = async (dispatch: AppDispatch) => {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEYS.MIGRATION_TO_V5);

    if (result[STORAGE_KEYS.MIGRATION_TO_V5]) {
      await migrateParams(dispatch);
      await migratePreferences(dispatch);
      await cleanUpOldKeys();
    }
  } catch (error) {
    console.error('Migration failed:', error);
  }
};
