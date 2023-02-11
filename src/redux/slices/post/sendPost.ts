import { createSlice as sendSlice, PayloadAction } from '@reduxjs/toolkit';
import { Descendant } from 'slate';
// types
import { ICreateComments, ISendPost } from 'src/@types/post';
import { Audience, MediaUrlInputType } from 'src/@types/sections/serverTypes';
import { RootState } from 'src/redux/store';

// ----------------------------------------------------------------------
const textValue = [
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  } as Descendant,
];
export const initialState: ISendPost = {
  audience: Audience.Public,
  mediaUrls: [],
  text: textValue,
  editMode: false,
  id: '',
  postType: '',
};

const slice = sendSlice({
  name: 'sendPost',
  initialState,
  reducers: {
    valuingAll(state, action: PayloadAction<ISendPost>) {
      state.audience = action.payload.audience;
      state.mediaUrls = action.payload.mediaUrls;
      state.text = action.payload.text;
      state.editMode = action.payload.editMode;
      state.id = action.payload.id;
      state.postType = action.payload.postType;
    },
    setSendPostId(state, action: PayloadAction<string>) {
      state.id = action.payload;
    },
    setSendPostType(state, action: PayloadAction<string>) {
      state.postType = action.payload;
    },
    setSendPostAudience(state, action: PayloadAction<Audience>) {
      state.audience = action.payload;
    },
    setSendPostText(state, action: PayloadAction<Descendant[]>) {
      state.text = action.payload;
    },
    setSendPostMediaUrls(state, action: PayloadAction<MediaUrlInputType[]>) {
      state.mediaUrls = action.payload;
    },

    resetSendPost(state) {
      state.audience = initialState.audience;
      state.mediaUrls = initialState.mediaUrls;
      state.text = initialState.text;
      state.editMode = initialState.editMode;
      state.id = initialState.id;
      state.postType = initialState.postType;
    },
  },
});

export const basicSendPostSelector = (state: RootState) =>
  <ISendPost>{
    audience: state.sendPost.audience,
    mediaUrls: state.sendPost.mediaUrls,
    text: state.sendPost.text,
    editMode: state.sendPost.editMode,
    id: state.sendPost.id,
    postType: state.sendPost.postType,
  };

export const commentTextEditorSelector = (state: RootState) => {
  <ICreateComments>{
    text: state.sendPost.text,
  };
};

export const richTextEditorSelector = (state: RootState) =>
  <Descendant[]>[
    {
      type: 'paragraph',
      children: [
        {
          text: '',
        },
      ],
    } as Descendant,
  ];

export const getSendAudience = (state: RootState) => <string>state.sendPost.audience;

// Reducer
export default slice.reducer;

// Actions
export const {
  setSendPostId,
  setSendPostType,
  setSendPostAudience,
  setSendPostMediaUrls,
  setSendPostText,
  valuingAll,
  resetSendPost,
} = slice.actions;
