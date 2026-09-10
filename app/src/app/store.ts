import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER,REHYDRATE } from 'redux-persist';
import { syncStorage } from 'redux-persist-webextension-storage';

import groupsSlice from '@/features/groups/groups-slice';
import paramsSlice from '@/features/params/params-slice';
import preferencesSlice, { preferencesTransform } from '@/features/preferences/preferences-slice';

const syncStorageConfig = {
  key: 'syncStorage',
  storage: syncStorage,
  transforms: [preferencesTransform],
};

const rootReducer = combineReducers({
  preferences: preferencesSlice,
  params: paramsSlice,
  groups: groupsSlice,
});

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(syncStorageConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
