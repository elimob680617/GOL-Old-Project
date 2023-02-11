import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { personSkillType, profileSkillState } from 'src/@types/sections/profile/userSkill';
// Types
import { RootState } from 'src/redux/store';

// initialState

const initialState: profileSkillState = {
  PersonSkillDto: {},
};

const slice = createSlice({
  name: 'userSkill',
  initialState,
  reducers: {
    skillUpdated(state, action: PayloadAction<personSkillType>) {
      state.PersonSkillDto = action.payload;
    },
  },
});

export const userSkillSelector = (state: RootState) => state.userPersonSkill.PersonSkillDto;

// reducer
export default slice.reducer;

// Action
export const { skillUpdated } = slice.actions;
