import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// types
import { ProjectType, ProfileProjectState } from 'src/@types/sections/profile/ngoProject';
import { RootState } from 'src/redux/store';

// ----------------------------------------------------------------------

const initialState: ProfileProjectState = {};

const slice = createSlice({
  name: 'ngoProject',
  initialState,
  reducers: {
    projectAdded(state, action: PayloadAction<ProjectType>) {
      state.project = { ...state.project, ...action.payload };
    },
    emptyProject(state) {
      state.project = undefined;
    },
  },
});

export const ngoProjectSelector = (state: RootState) => state.ngoProject.project;

// Reducer
export default slice.reducer;

// Actions
export const { projectAdded, emptyProject } = slice.actions;
