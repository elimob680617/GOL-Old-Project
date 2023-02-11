import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConversationContactResponseDto } from 'src/@types/sections/serverTypes';

export interface selectedUserType {
  onChatUser: ConversationContactResponseDto;
}

const initialState: selectedUserType = {
  onChatUser: {},
};

export const selectedUserSlice = createSlice({
  name: 'selectedUserSlice',
  initialState,
  reducers: {
    onSelectUser: (state, action: PayloadAction<ConversationContactResponseDto>) => {
      state.onChatUser = action.payload;
    },
    onRestUser: (state) => {
      state.onChatUser = {};
    },
  },
});

export const { onSelectUser, onRestUser } = selectedUserSlice.actions;

export default selectedUserSlice.reducer;
