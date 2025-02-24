import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Preferences } from '@/types/';

const initialState: Preferences = {
  basicMode: false,
  newTab: true,
  sidePanel: false,
};

type ToggleActionPayload = {
  property: keyof Preferences;
};

type ValueActionPayload = {
  property: keyof Preferences;
  value: boolean;
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    togglePreference(state, action: PayloadAction<ToggleActionPayload>) {
      const { property } = action.payload;
      state[property] = !state[property];
    },
    setPreference(state, action: PayloadAction<ValueActionPayload>) {
      const { property, value } = action.payload;
      state[property] = value;
    },
  },
});

export const { togglePreference, setPreference } = preferencesSlice.actions;
export default preferencesSlice.reducer;
