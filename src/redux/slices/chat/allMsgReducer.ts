import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { allMsgState } from 'src/@types/chat';
import { MessageResponseDto } from 'src/@types/sections/serverTypes';

const initialState: allMsgState = {
  allMsgState: [],
};

export const allMsgSlice = createSlice({
  name: 'allMsgSlice',
  initialState,
  reducers: {
    onGetAllMsg: (state, action: PayloadAction<MessageResponseDto[]>) => {
      state.allMsgState = action.payload;
    },
    onUpdateMsg: (state, action: PayloadAction<MessageResponseDto>) => {
      state.allMsgState.unshift(action.payload);
    },
    onPaginateMsg: (state, action: PayloadAction<MessageResponseDto[]>) => {
      const temp = [...state.allMsgState];
      if (action.payload.length) {
        state.allMsgState = [...temp, ...action.payload];
      }
    },
  },
});

export const { onGetAllMsg, onUpdateMsg, onPaginateMsg } = allMsgSlice.actions;

export default allMsgSlice.reducer;
