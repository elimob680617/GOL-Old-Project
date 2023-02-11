import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IIndustry } from 'src/@types/categories';
import { ICollege } from 'src/@types/education';
import { IExperirnce } from 'src/@types/experience';
import { IPlace } from 'src/@types/location';
import { ConnectionStatusType, SearchCategoryEnumType } from 'src/@types/sections/serverTypes';
import { ISkil } from 'src/@types/skill';
import { ISearchedUser, ISearchNgoReponse, ISearchUserResponse } from 'src/@types/user';

// types
import { RootState } from 'src/redux/store';
import { searchTabs } from 'src/sections/search/SearchMain';

// ----------------------------------------------------------------------

export interface ISearchedKeyWord {
  id?: any | null;
  keyword?: string | null;
}
export interface IFilters {
  searchedText: string;
  locations: IPlace[];
  skills: ISkil[];
  companyWorkeds: IExperirnce[];
  universities: ICollege[];
  colleges: ICollege[];
  peoples: ISearchedUser[];
  sortBy: string;
  companySize: string;
  postType: string;
  fundraisingType: string;
  fundraisingCategory: SearchCategoryEnumType[];
  industries: IIndustry[];
  mediaCreationTime: string;
  ngoSize: string[];
  ngos: ISearchNgoReponse[];
}

export interface ISearch {
  filters: IFilters;
  searchedPeople: ISearchUserResponse[];
  searchedNgo: ISearchNgoReponse[];
  lastKeyWords: ISearchedKeyWord[];
  Post: any[];
  Fundraising: any[];
  People: any[];
  Ngo: any[];
  loading: boolean;
  count: number;
  Hashtags: any[];
}

export const filterInitialState: IFilters = {
  searchedText: '',
  colleges: [],
  companyWorkeds: [],
  locations: [],
  skills: [],
  sortBy: '',
  universities: [],
  peoples: [],
  postType: '',
  fundraisingType: '',
  fundraisingCategory: [],
  industries: [],
  companySize: '',
  mediaCreationTime: '',
  ngoSize: [],
  ngos: [],
};

const initialState: ISearch = {
  filters: filterInitialState,
  searchedPeople: [],
  searchedNgo: [],
  lastKeyWords: [],
  Post: [],
  Fundraising: [],
  People: [],
  Ngo: [],
  loading: false,
  count: 0,
  Hashtags: [],
};

const slice = createSlice({
  name: 'searchSlice',
  initialState,
  reducers: {
    valuingSearchValues(state, action: PayloadAction<IFilters>) {
      state.filters.colleges = action.payload.colleges;
      state.filters.companyWorkeds = action.payload.companyWorkeds;
      state.filters.locations = action.payload.locations;
      state.filters.searchedText = action.payload.searchedText;
      state.filters.skills = action.payload.skills;
      state.filters.sortBy = action.payload.sortBy;
      state.filters.universities = action.payload.universities;
      state.filters.peoples = action.payload.peoples;
      state.filters.postType = action.payload.postType;
      state.filters.fundraisingType = action.payload.fundraisingType;
      state.filters.fundraisingCategory = action.payload.fundraisingCategory;
      state.filters.industries = action.payload.industries;
      state.filters.companySize = action.payload.companySize;
      state.filters.mediaCreationTime = action.payload.mediaCreationTime;
      state.filters.ngoSize = action.payload.ngoSize;
      state.filters.ngos = action.payload.ngos;
    },
    setSearchLocation(state, action: PayloadAction<IPlace[]>) {
      state.filters.locations = action.payload;
    },
    setSearchNgoFilter(state, action: PayloadAction<ISearchNgoReponse[]>) {
      state.filters.ngos = action.payload;
    },
    setSearchSkill(state, action: PayloadAction<ISkil[]>) {
      state.filters.skills = action.payload;
    },
    addSearchCollege(state, action: PayloadAction<ICollege>) {
      state.filters.colleges = [...state.filters.colleges, action.payload];
    },
    removeSearchCollege(state, action: PayloadAction<ICollege>) {
      state.filters.colleges = [...state.filters.colleges.filter((i) => i.id !== action.payload.id)];
    },
    addSearchUniversity(state, action: PayloadAction<ICollege>) {
      state.filters.universities = [...state.filters.universities, action.payload];
    },
    removeSearchUniversity(state, action: PayloadAction<ICollege>) {
      state.filters.universities = [...state.filters.universities.filter((i) => i.id !== action.payload.id)];
    },
    addSearchCompany(state, action: PayloadAction<IExperirnce>) {
      state.filters.companyWorkeds = [...state.filters.companyWorkeds, action.payload];
    },
    removeSearchCompany(state, action: PayloadAction<IExperirnce>) {
      state.filters.companyWorkeds = [...state.filters.companyWorkeds.filter((i) => i.id !== action.payload.id)];
    },
    addSearchPeople(state, action: PayloadAction<ISearchedUser>) {
      state.filters.peoples = [...state.filters.peoples, action.payload];
    },
    removeSearchPeople(state, action: PayloadAction<ISearchedUser>) {
      state.filters.peoples = [...state.filters.peoples.filter((i) => i.id !== action.payload.id)];
    },
    setSearchSor(state, action: PayloadAction<string>) {
      state.filters.sortBy = action.payload;
    },
    setSearchPostType(state, action: PayloadAction<string>) {
      state.filters.postType = action.payload;
    },
    setSearchFundraisingType(state, action: PayloadAction<string>) {
      state.filters.fundraisingType = action.payload;
    },
    addFundraisingCategory(state, action: PayloadAction<SearchCategoryEnumType>) {
      state.filters.fundraisingCategory = [...state.filters.fundraisingCategory, action.payload];
    },
    removeFundraisingCategory(state, action: PayloadAction<SearchCategoryEnumType>) {
      state.filters.fundraisingCategory = [...state.filters.fundraisingCategory.filter((i) => i !== action.payload)];
    },
    addIndustry(state, action: PayloadAction<IIndustry>) {
      state.filters.industries = [...state.filters.industries, action.payload];
    },
    removeIndustry(state, action: PayloadAction<IIndustry>) {
      state.filters.industries = [...state.filters.industries.filter((i) => i.id !== action.payload.id)];
    },
    setSearchCompanySize(state, action: PayloadAction<string>) {
      state.filters.companySize = action.payload;
    },
    setMediaCreationTime(state, action: PayloadAction<string>) {
      state.filters.mediaCreationTime = action.payload;
    },
    setNgoSize(state, action: PayloadAction<string[]>) {
      state.filters.ngoSize = action.payload;
    },
    resetSearch(state) {
      state.filters.colleges = initialState.filters.colleges;
      state.filters.companyWorkeds = initialState.filters.companyWorkeds;
      state.filters.locations = initialState.filters.locations;
      // state.filters.searchedText = initialState.filters.searchedText;
      state.filters.skills = initialState.filters.skills;
      state.filters.sortBy = initialState.filters.sortBy;
      state.filters.universities = initialState.filters.universities;
      state.filters.peoples = initialState.filters.peoples;
      state.filters.postType = initialState.filters.postType;
      state.filters.fundraisingType = initialState.filters.fundraisingType;
      state.filters.fundraisingCategory = initialState.filters.fundraisingCategory;
      state.filters.industries = initialState.filters.industries;
      state.filters.companySize = initialState.filters.companySize;
      state.filters.mediaCreationTime = initialState.filters.mediaCreationTime;
      state.filters.ngoSize = initialState.filters.ngoSize;
      state.filters.ngos = initialState.filters.ngos;
    },
    setSearchedText(state, action: PayloadAction<string>) {
      state.filters.searchedText = action.payload;
    },
    setSearchedPeoples(state, action: PayloadAction<ISearchUserResponse[]>) {
      state.searchedPeople = action.payload;
    },
    changeSearchedUserStatus(
      state,
      action: PayloadAction<{
        index: number;
        otherToMe: ConnectionStatusType;
        meToOther: ConnectionStatusType;
      }>
    ) {
      const temp = state.searchedPeople[action.payload.index];

      state.searchedPeople.splice(action.payload.index, 1, {
        ...temp,
        otherToMeStatus: action.payload.otherToMe,
        meToOtherStatus: action.payload.meToOther,
      });
    },
    setSearchedNgos(state, action: PayloadAction<ISearchUserResponse[]>) {
      state.searchedNgo = action.payload;
    },
    changeSearchedNgoStatus(
      state,
      action: PayloadAction<{
        index: number;
        otherToMe: ConnectionStatusType;
        meToOther: ConnectionStatusType;
      }>
    ) {
      const temp = state.searchedNgo[action.payload.index];

      state.searchedNgo.splice(action.payload.index, 1, {
        ...temp,
        otherToMeStatus: action.payload.otherToMe,
        meToOtherStatus: action.payload.meToOther,
      });
    },
    valuingAllSearchedKeyWord(state, action: PayloadAction<ISearchedKeyWord[]>) {
      state.lastKeyWords = action.payload;
    },
    addKeyWord(state, action: PayloadAction<ISearchedKeyWord>) {
      state.lastKeyWords = [action.payload, ...state.lastKeyWords];
    },
    removeKeyWord(state, action: PayloadAction<string>) {
      state.lastKeyWords = [...state.lastKeyWords.filter((i) => i.id !== action.payload)];
    },
    setValues(state, action: PayloadAction<{ searchTab: searchTabs; data: any[] }>) {
      state[action.payload.searchTab] = action.payload.data;
    },
    updateValues(state, action: PayloadAction<{ searchTab: searchTabs; data: any[] }>) {
      state[action.payload.searchTab] = [...state[action.payload.searchTab], ...action.payload.data];
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setCount(state, action: PayloadAction<number>) {
      state.count = action.payload;
    },
    resetAllSearched(state) {
      state.count = 0;
      state.loading = false;
      state.Fundraising = [];
      state.Hashtags = [];
      state.Ngo = [];
      state.People = [];
      state.Post = [];
    },
  },
});

export const getSearchedValues = (state: RootState) => <IFilters>state.searchSlice.filters;
export const getSearchedPeoples = (state: RootState) => <ISearchUserResponse[]>state.searchSlice.searchedPeople;
export const getSearchedNgos = (state: RootState) => <ISearchNgoReponse[]>state.searchSlice.searchedNgo;
export const getSearchedLastKeyWords = (state: RootState) => <ISearchedKeyWord[]>state.searchSlice.lastKeyWords;
export const getSearchedSocialPosts = (state: RootState) => <any[]>state.searchSlice.Post;
export const getSearchLoading = (state: RootState) => <boolean>state.searchSlice.loading;
export const getSearchCount = (state: RootState) => <number>state.searchSlice.count;
export const getSearchedHashtags = (state: RootState) => <any[]>state.searchSlice.Hashtags;
export const getSearchedNgo = (state: RootState) => <any[]>state.searchSlice.Ngo;
export const getSearchedPeople = (state: RootState) => <any[]>state.searchSlice.People;
export const getSearchedCampaginPost = (state: RootState) => <any[]>state.searchSlice.Fundraising;

// Reducer
export default slice.reducer;

// Actions
export const {
  resetSearch,
  valuingSearchValues,
  setSearchLocation,
  setSearchSkill,
  addSearchCollege,
  removeSearchCollege,
  addSearchUniversity,
  removeSearchUniversity,
  addSearchCompany,
  removeSearchCompany,
  setSearchSor,
  addSearchPeople,
  removeSearchPeople,
  setSearchPostType,
  setSearchFundraisingType,
  addFundraisingCategory,
  removeFundraisingCategory,
  addIndustry,
  removeIndustry,
  setSearchCompanySize,
  setMediaCreationTime,
  setSearchedText,
  setSearchedPeoples,
  changeSearchedUserStatus,
  changeSearchedNgoStatus,
  setSearchedNgos,
  setNgoSize,
  setSearchNgoFilter,
  addKeyWord,
  removeKeyWord,
  valuingAllSearchedKeyWord,
  setValues,
  updateValues,
  setLoading,
  setCount,
  resetAllSearched,
} = slice.actions;
