import { createSlice as shareSlice, PayloadAction } from '@reduxjs/toolkit';
import { Descendant } from 'slate';
// types
import { ICreateComments, ISharePost } from 'src/@types/post';
import { Audience, MediaUrlInputType } from 'src/@types/sections/serverTypes';
import { ILocationSelect } from 'src/components/location/LocationSelect';
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
export const initialState: ISharePost = {
  audience: Audience.Public,
  mediaUrls: [],
  location: null,
  text: textValue,
  editMode: false,
  id: '',
  postType: '',
  sharedPostType: '',
  sharePostId: '',
};

const slice = shareSlice({
  name: 'sharePost',
  initialState,
  reducers: {
    valuingAll(state, action: PayloadAction<ISharePost>) {
      state.audience = action.payload.audience;
      state.location = action.payload.location;
      state.mediaUrls = action.payload.mediaUrls;
      state.text = action.payload.text;
      state.editMode = action.payload.editMode;
      state.id = action.payload.id;
      state.sharePostId = action.payload.sharePostId;
      state.postType = action.payload.sharedPostType;
      state.sharedPostType = action.payload.sharedPostType;
    },
    setSharedPostId(state, action: PayloadAction<string>) {
      state.id = action.payload;
    },

    setSharePostId(state, action: PayloadAction<string>) {
      state.id = action.payload;
    },
    setPostType(state, action: PayloadAction<string>) {
      state.postType = action.payload;
    },
    setSharedPostType(state, action: PayloadAction<string>) {
      state.sharedPostType = action.payload;
    },

    setSharedPostAudience(state, action: PayloadAction<Audience>) {
      state.audience = action.payload;
    },
    setSharedPostText(state, action: PayloadAction<Descendant[]>) {
      state.text = action.payload;
    },
    setSharedPostLocation(state, action: PayloadAction<ILocationSelect | null>) {
      state.location = action.payload;
    },
    setSharedPostMediaUrls(state, action: PayloadAction<MediaUrlInputType[]>) {
      state.mediaUrls = action.payload;
    },
    setSharedPostEditMode(state, action: PayloadAction<boolean>) {
      state.editMode = action.payload;
    },

    resetSharedPost(state) {
      state.audience = initialState.audience;
      state.location = initialState.location;
      state.text = initialState.text;
      state.mediaUrls = initialState.mediaUrls;
      state.editMode = initialState.editMode;
      state.id = initialState.id;
      state.sharePostId = initialState.sharePostId;
      state.sharedPostType = initialState.sharedPostType;
    },
  },
});

export const basicSharePostSelector = (state: RootState) =>
  <ISharePost>{
    audience: state.sharePost.audience,
    mediaUrls: state.sendPost.mediaUrls,
    location: state.sharePost.location,
    text: state.sharePost.text,
    editMode: state.sharePost.editMode,
    id: state.sharePost.id,
    sharePostId: state.sharePost.sharePostId,
    sharedPostType: state.sharePost.sharedPostType,
  };

export const commentTextEditorSelector = (state: RootState) => {
  <ICreateComments>{
    text: state.sharePost.text,
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

export const getShareAudience = (state: RootState) => <string>state.sharePost.audience;

// Reducer
export default slice.reducer;

// Actions
export const {
  setSharedPostId,
  setSharePostId,
  setPostType,
  setSharedPostType,
  setSharedPostAudience,
  setSharedPostEditMode,
  setSharedPostMediaUrls,
  setSharedPostLocation,
  setSharedPostText,
  valuingAll,
  resetSharedPost,
} = slice.actions;
