import { RootState } from 'src/redux/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserCollegeType, profileCollegeState } from 'src/@types/sections/profile/userColleges';
// import { AudienceEnum } from 'src/@types/sections/serverTypes';

const initialState: profileCollegeState = {};

const slice = createSlice({
  name: 'userColleges',
  initialState,
  reducers: {
    userCollegeUpdated(state, action: PayloadAction<UserCollegeType>) {
      state.college = { ...state.college, ...action.payload };
    },
    emptyCollege(state) {
      state.college = undefined;
    },
  },
});

export const userCollegesSelector = (state: RootState) => state.userColleges.college;
// Reducer
export default slice.reducer;
// Actions
export const { userCollegeUpdated, emptyCollege } = slice.actions;
