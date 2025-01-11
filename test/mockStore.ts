import { configureStore } from '@reduxjs/toolkit';
import { Param } from '@/types';
import paramsSlice from '@/features/params/params-slice';
import preferencesSlice from '@/features/preferences/preferences-slice';

export type PreloadedState = {
  params?: {
    data: Param[];
  };
  preferences?: {
    basicMode: boolean;
    newTab: boolean;
  };
};

export const createMockStore = (initialState: PreloadedState = {}) => {
  return configureStore({
    reducer: {
      params: paramsSlice,
      preferences: preferencesSlice,
    },
    preloadedState: {
      params: {
        data: [
          { id: '1', title: '/admin/' },
          { id: '2', title: '/wp-admin/' },
        ],
        ...initialState.params,
      },
      preferences: {
        basicMode: true,
        newTab: false,
        ...initialState.preferences,
      },
    },
  });
};
