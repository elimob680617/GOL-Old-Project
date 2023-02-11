import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// types
import { ExperienceType, ProfileExperiencesState } from 'src/@types/sections/profile/userExperiences';
import { RootState } from 'src/redux/store';

// ----------------------------------------------------------------------

const initialState: ProfileExperiencesState = {};

const slice = createSlice({
  name: 'userExperiences',
  initialState,
  reducers: {
    experienceAdded(state, action: PayloadAction<ExperienceType>) {
      state.experience = { ...state.experience, ...action.payload };
    },
    emptyExperience(state) {
      state.experience = undefined;
    },
  },
});

export const userExperienceSelector = (state: RootState) => state.userExperiences.experience;

// Reducer
export default slice.reducer;

// Actions
export const { experienceAdded, emptyExperience } = slice.actions;
