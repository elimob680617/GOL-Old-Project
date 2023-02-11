import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// types
import { userPhoneNumberState, UserPhoneNumberType } from 'src/@types/sections/profile/userPhoneNumber';
import { RootState } from 'src/redux/store';

const initialState: userPhoneNumberState = {
  // phoneNumber: {
  //   audience: AudienceEnum.Public,
  //   status: VerificationStatusEnum.Pending,
  // },
};

const slice = createSlice({
  name: 'userPhoneNumber',
  initialState,
  reducers: {
    phoneNumberAdded(state, action: PayloadAction<UserPhoneNumberType>) {
      state.phoneNumber = { ...state.phoneNumber, ...action.payload };
    },
    phoneNumberCleared(state) {
      state.phoneNumber = undefined;
    },
  },
});

export const userPhoneNumberSelector = (state: RootState) => state.userPhoneNumber.phoneNumber;

// Actions
export const { phoneNumberAdded, phoneNumberCleared } = slice.actions;

// Reducer
export default slice.reducer;
