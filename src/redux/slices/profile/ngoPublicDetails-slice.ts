import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  EstablishmentdDatePayloadType,
  GroupCategoryPayloadType,
  NGOPublicDetailsState,
  NumberRangePayloadType,
  PlacePayloadType,
} from 'src/@types/sections/profile/ngoPublicDetails';
import { RootState } from 'src/redux/store';

const initialState: NGOPublicDetailsState = {};
const slice = createSlice({
  name: 'ngoPublicDetails',
  initialState,
  reducers: {
    ngoCategoryUpdated(state, action: PayloadAction<GroupCategoryPayloadType>) {
      state.categoryGroup = { ...state.categoryGroup, ...action.payload };
    },
    ngoCategoryWasEmpty(state) {
      state.categoryGroup = undefined;
    },
    ngoEstablishmentDateUpdated(state, action: PayloadAction<EstablishmentdDatePayloadType>) {
      state.establishedDate = { ...state.establishedDate, ...action.payload };
    },
    ngoEstablishmentDateWasEmpty(state) {
      state.establishedDate = undefined;
    },
    ngoSizeUpdated(state, action: PayloadAction<NumberRangePayloadType>) {
      state.rangeNumber = { ...state.rangeNumber, ...action.payload };
    },
    ngoSizeWasEmpty(state) {
      state.rangeNumber = undefined;
    },
    ngoPlaceUpdated(state, action: PayloadAction<PlacePayloadType>) {
      state.place = { ...state.place, ...action.payload };
    },
    ngoPlaceWasEmpty(state) {
      state.place = undefined;
    },
    // ngoJoinAudiene(state, action: PayloadAction<AudienceEnum>){
    //   state.joinAudience=action.payload
    // }
  },
});

// SELECTORS
export const ngoCategorySelector = (state: RootState) => state.ngoPublicDetails.categoryGroup;
export const ngoSizeSelector = (state: RootState) => state.ngoPublicDetails.rangeNumber;
export const ngoEstablishmentDateSelector = (state: RootState) => state.ngoPublicDetails.establishedDate;
export const ngoPlaceSelector = (state: RootState) => state.ngoPublicDetails.place;
// Reducer
export default slice.reducer;
// Actions
export const {
  ngoCategoryUpdated,
  ngoCategoryWasEmpty,
  ngoEstablishmentDateUpdated,
  ngoEstablishmentDateWasEmpty,
  ngoSizeUpdated,
  ngoSizeWasEmpty,
  ngoPlaceUpdated,
  ngoPlaceWasEmpty,
} = slice.actions;
