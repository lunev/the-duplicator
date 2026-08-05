import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Group } from '@/types/';

type GroupsState = {
  data: Group[];
};

const initialGroups: Group[] = [];

const initialState: GroupsState = {
  data: initialGroups,
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    addGroup(state, action: PayloadAction<Group>) {
      state.data.push(action.payload);
    },
    removeGroup(state, action: PayloadAction<Group>) {
      state.data = state.data.filter((group) => group.id !== action.payload.id);
    },
    updateGroup(state, action: PayloadAction<Group>) {
      const index = state.data.findIndex((group) => group.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    updateAllGroups(state, action: PayloadAction<Group[]>) {
      state.data = action.payload;
    },
    moveParamToGroup(state, action: PayloadAction<{ groupId: string; paramId: string }>) {
      const { groupId, paramId } = action.payload;

      // Remove param from all groups first
      state.data.forEach((g) => {
        g.items = g.items.filter((id) => id !== paramId);
      });

      // Add param to the new group if found
      const targetGroup = state.data.find((g) => g.id === groupId);
      if (targetGroup && !targetGroup.items.includes(paramId)) {
        targetGroup.items.push(paramId);
      }
    },
    addParamToGroup(state, action: PayloadAction<{ groupId: string; paramId: string }>) {
      const { groupId, paramId } = action.payload;
      const targetGroup = state.data.find((g) => g.id === groupId);
      if (targetGroup && !targetGroup.items.includes(paramId)) {
        targetGroup.items.push(paramId);
      }
    },
    removeParamFromGroup(state, action: PayloadAction<{ paramId: string; groupId: string }>) {
      const { groupId, paramId } = action.payload;
      const group = state.data.find((group) => group.id === groupId);

      if (group) {
        group.items = group.items.filter((id) => id !== paramId);
      }
    },
    removeParamFromAllGroups(state, action: PayloadAction<{ paramId: string }>) {
      const { paramId } = action.payload;
      state.data.forEach((g) => {
        g.items = g.items.filter((id) => id !== paramId);
      });
    },
    activateGroup(state, action: PayloadAction<{ groupId: string }>) {
      const index = state.data.findIndex((group) => group.id === action.payload.groupId);
      state.data.forEach((g) => {
        g.selected = false;
      });
      if (index !== -1) {
        state.data[index].selected = true;
      }
    },
  },
});

export const {
  addGroup,
  removeGroup,
  updateGroup,
  updateAllGroups,
  moveParamToGroup,
  addParamToGroup,
  removeParamFromGroup,
  removeParamFromAllGroups,
  activateGroup,
} = groupsSlice.actions;
export default groupsSlice.reducer;
