import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PersonInput } from 'src/@types/sections/serverTypes';
import { RootState } from 'src/redux/store';

export interface PersonInputType {
  mainInfo?: PersonInput;
}

const initialState: PersonInputType = {};

const slice = createSlice({
  name: 'userMainInfo',
  initialState,
  reducers: {
    updateMainInfo(state, action: PayloadAction<PersonInput & { isChange?: boolean }>) {
      state.mainInfo = { ...state.mainInfo, ...action.payload };
    },
    mainInfoCleared(state) {
      state.mainInfo = undefined;
    },
  },
});

export const userMainInfoSelector = (state: RootState) => state.userMainInfo.mainInfo;

// Reducer
export default slice.reducer;

// Actions
export const { updateMainInfo, mainInfoCleared } = slice.actions;
