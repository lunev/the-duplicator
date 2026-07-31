import { combineReducers, configureStore } from '@reduxjs/toolkit';
import preferencesSlice, { preferencesTransform } from '@/features/preferences/preferences-slice';
import paramsSlice from '@/features/params/params-slice';
import groupsSlice from '@/features/groups/groups-slice';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { syncStorage } from 'redux-persist-webextension-storage';

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
