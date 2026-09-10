import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Param } from '@/types/';

type ParamsState = {
  data: Param[];
};

const initialState: ParamsState = {
  data: [],
};

const paramsSlice = createSlice({
  name: 'params',
  initialState,
  reducers: {
    addParam(state, action: PayloadAction<Param>) {
      state.data.push(action.payload);
    },
    removeParam(state, action: PayloadAction<Param>) {
      state.data = state.data.filter((param) => param.id !== action.payload.id);
    },
    updateParam(state, action: PayloadAction<Param>) {
      const index = state.data.findIndex((param) => param.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    updateAllParams(state, action: PayloadAction<Param[]>) {
      state.data = action.payload;
    },
  },
});

export const { addParam, removeParam, updateParam, updateAllParams } = paramsSlice.actions;
export default paramsSlice.reducer;
