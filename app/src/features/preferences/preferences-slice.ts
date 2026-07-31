import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createTransform } from 'redux-persist';
import { Preferences } from '@/types/';

type ToggleActionPayload = {
  property: keyof Preferences;
};

type ValueActionPayload = {
  property: keyof Preferences;
  value: boolean;
};

const initialState: Preferences = {
  basicMode: false,
  newTab: true,
  sidePanel: false,
  showGroups: true,
  showForm: true,
};

export const preferencesTransform = createTransform<Preferences, Preferences>(
  (inboundState) => ({
    ...initialState,
    ...inboundState,
  }),
  (outboundState) => outboundState,
);

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
