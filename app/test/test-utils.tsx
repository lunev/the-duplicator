import { configureStore } from '@reduxjs/toolkit';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { Group, Param, Preferences } from '@/types';

import groupsSlice from '../src/features/groups/groups-slice';
import paramsSlice from '../src/features/params/params-slice';
import preferencesSlice from '../src/features/preferences/preferences-slice';

export const mockStorageLocalGet = (value: Record<string, unknown>) => {
  vi.mocked(chrome.storage.local.get).mockImplementation(
    (() => Promise.resolve(value)) as typeof chrome.storage.local.get,
  );
};

export const initialState = {
  params: {
    data: [
      { id: '1', title: '/admin/' },
      { id: '2', title: '/wp-admin/' },
    ] as Param[],
  },
  preferences: {
    basicMode: false,
    newTab: false,
    sidePanel: false,
    showGroups: false,
    showForm: true,
  } as Preferences,
  groups: {
    data: [] as Group[],
  },
};

const createMockStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      params: paramsSlice,
      preferences: preferencesSlice,
      groups: groupsSlice,
    },
    preloadedState,
  });

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Record<string, unknown>;
  store?: ReturnType<typeof createMockStore>;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = initialState,
    store = createMockStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <MemoryRouter>{children}</MemoryRouter>
    </Provider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
