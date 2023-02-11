import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BasicInfoState, LocationPayloadType } from 'src/@types/afterRegister';
import { GenderEnum } from 'src/@types/sections/serverTypes';
import { RootState } from 'src/redux/store';

const initialState: BasicInfoState = {
  intrestedCategories: [],
  joinReasons: [],
};
const slice = createSlice({
  name: 'basicInfo',
  initialState,
  reducers: {
    registerGenderUpdated(state, action: PayloadAction<GenderEnum | undefined>) {
      state.gender = action.payload;
    },
    registerWorkFieldUpdated(state, action: PayloadAction<string | undefined>) {
      state.workingField = action.payload;
    },
    registerLocationUpdated(state, action: PayloadAction<LocationPayloadType | undefined>) {
      state.location = action.payload;
    },
    registerIntrestedCategoriesUpdated(state, action: PayloadAction<string[]>) {
      state.intrestedCategories = [...action.payload];
    },
    registerJoinReasonsUpdated(state, action: PayloadAction<string[]>) {
      state.joinReasons = [...action.payload];
    },
  },
});

// SELECTORS
export const registerGenderSelector = (state: RootState) => state.afterRegister.gender;
export const registerIntrestedCategoriesSelector = (state: RootState) => state.afterRegister.intrestedCategories;
export const registerWorkFieldSelector = (state: RootState) => state.afterRegister.workingField;
export const registerJoinReasonsSelector = (state: RootState) => state.afterRegister.joinReasons;
export const registerLocationSelector = (state: RootState) => state.afterRegister.location;
// Reducer
export default slice.reducer;
// Actions
export const {
  registerGenderUpdated,
  registerIntrestedCategoriesUpdated,
  registerJoinReasonsUpdated,
  registerWorkFieldUpdated,
  registerLocationUpdated,
} = slice.actions;
