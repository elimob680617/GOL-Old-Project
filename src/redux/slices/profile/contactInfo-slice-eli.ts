import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'src/redux/store';
import { PersonEmailType, ProfileEmailsState } from 'src/@types/sections/profile/userEmails';

const initialState: ProfileEmailsState = {
  emails: [],
  //   email: {},
};

const slice = createSlice({
  name: 'userEmails',
  initialState,
  reducers: {
    addedEmail(state, action: PayloadAction<PersonEmailType>) {
      // state.emails = { ...state.email, ...action.payload };
      state.email = action.payload;
    },
    emptyEmail(state, action: PayloadAction<PersonEmailType>) {
      state.email = undefined;
    },
  },
});

export const userEmailsSelector = (state: RootState) => state.userEmails.email;

// Reducer
export default slice.reducer;

// Actions
export const { addedEmail, emptyEmail } = slice.actions;
