import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LocationType, UserLocationState } from 'src/@types/sections/profile/publicDetails';
import { RootState } from 'src/redux/store';

const initialState: UserLocationState = {};

const slice = createSlice({
  name: 'userLocation',
  initialState,
  reducers: {
    userLocationUpdated(state, action: PayloadAction<LocationType>) {
      state.city = { ...state.city, ...action.payload };
    },
    emptyLocation(state) {
      state.city = undefined;
    },
  },
});
export const userLocationSelector = (state: RootState) => state.userLocation.city;

// Reducer
export default slice.reducer;

// Actions
export const { userLocationUpdated, emptyLocation } = slice.actions;
