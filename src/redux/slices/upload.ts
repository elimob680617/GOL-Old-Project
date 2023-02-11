import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUploadingFiles } from 'src/components/upload/GolUploader';
import { RootState } from 'src/redux/store';

// ----------------------------------------------------------------------
export interface IUpload {
  uploadingFiles: IUploadingFiles[];
}

const initialState: IUpload = {
  uploadingFiles: [],
};

const slice = createSlice({
  name: 'uploadSlice',
  initialState,
  reducers: {
    setUploadingFiles(state, action: PayloadAction<IUploadingFiles[]>) {
      state.uploadingFiles = action.payload;
    },
    reset(state) {
      state.uploadingFiles = [];
    },
  },
});

export const getUploadingFiles = (state: RootState) => <IUploadingFiles[]>state.upload.uploadingFiles;

// Reducer
export default slice.reducer;

// Actions
export const { setUploadingFiles, reset } = slice.actions;
