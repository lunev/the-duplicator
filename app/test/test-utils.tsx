import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import paramsSlice from '../src/features/params/params-slice';
import preferencesSlice from '../src/features/preferences/preferences-slice';
import { Param, Preferences } from '@/types';

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
};

const createMockStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      params: paramsSlice,
      preferences: preferencesSlice,
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
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        {children}
      </MemoryRouter>
    </Provider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
