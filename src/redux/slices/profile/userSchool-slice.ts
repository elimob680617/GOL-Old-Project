import { RootState } from 'src/redux/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserSchoolType, profileSchoolState } from 'src/@types/sections/profile/userSchools';

const initialState: profileSchoolState = {};

const slice = createSlice({
  name: 'userSchools',
  initialState,
  reducers: {
    userSchoolUpdated(state, action: PayloadAction<UserSchoolType>) {
      state.school = { ...state.school, ...action.payload };
    },
    schoolWasEmpty(state) {
      state.school = undefined;
    },
    // schoolChanged(state,action:PayloadAction<boolean>){
    //     state.isChange=action.payload
    // },
    // schoolUnchanged(state,action:PayloadAction<boolean>){
    //     state.isChange=action.payload
    // },
  },
});

export const userSchoolsSelector = (state: RootState) => state.userSchools.school;
//   export const userIsChangeSchoolsSelector = (state: RootState) => state.userSchools.isChange;
// Reducer
export default slice.reducer;
// Actions
export const { userSchoolUpdated, schoolWasEmpty } = slice.actions;
