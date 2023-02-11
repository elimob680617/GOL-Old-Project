// redux
import { combineReducers } from 'redux';
// import { persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { reducers as chatApiReducers } from './CHAT_APIs';
// api-reducers
import { reducers as cognitoApiReducers } from './COGNITO_APIs';
import { reducers as connectionApiReducers } from './CONNECTION_APIs';
import { reducers as localityApiReducers } from './LOCALITY_APIs';
import { reducers as postBehaviorApiReducers } from './POSTBEHAVIOR_APIs';
import { reducers as postApiReducers } from './POST_APIs';
import { reducers as profileApiReducers } from './PROFILE_APIs';
import { reducers as historyApiReducers } from './HISTORY_APIs';
// slices
import authReducer from './slices/auth';
import allMsgReducer from './slices/chat/allMsgReducer';
import selectedUserReducer from './slices/chat/selectedUser';
import selectMsgReducer from './slices/chat/selectMsgReducer';
import connectionReducer from './slices/connection/connections';
import homePageReducer from './slices/homePage';
import createSocialPostReducer from './slices/post/createSocialPost';
import sendPostReducer from './slices/post/sendPost';
import sharePostReducer from './slices/post/sharePost';
import userEmailsReducer from './slices/profile/contactInfo-slice-eli';
import ngoProfileBioReducer from './slices/profile/ngoProfileBio-slice';
import ngoProjectReducer from './slices/profile/ngoProject-slice';
import ngoPublicDetailsSlice from './slices/profile/ngoPublicDetails-slice';
import userSocialMediasReducer from './slices/profile/socialMedia-slice';
import userCertificatesReducer from './slices/profile/userCertificates-slice';
import userCollegesReducer from './slices/profile/userColloges-slice';
// section slices
import userExperiencesReducer from './slices/profile/userExperiences-slice';
import userLocationReducer from './slices/profile/userLocation-slice';
import userMainInfoReducer from './slices/profile/userMainInfo-slice';
import userPhoneNumberReducer from './slices/profile/userPhoneNumber-slice';
import userRelationShipReducer from './slices/profile/userRelationShip-slice';
import userSchoolsReducer from './slices/profile/userSchool-slice';
import userpersonSkillReducer from './slices/profile/userSkill-slice';
import userUniversityReducer from './slices/profile/userUniversity-slice';
import userWebsitesReducer from './slices/profile/userWebsite-slice';
import uploadReducer from './slices/upload';
import { reducers as uploadApiReducers } from './UPLOAD_APIs';
import searchReducer from './slices/search';
import { reducers as searchApiReducers } from './SEARCH_APIs';
import afterRegistration from './slices/afterRegistration';

// ----------------------------------------------------------------------

const createNoopStorage = () => ({
  getItem(_key: string) {
    return Promise.resolve(null);
  },
  setItem(_key: string, value: any) {
    return Promise.resolve(value);
  },
  removeItem(_key: string) {
    return Promise.resolve();
  },
});

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const rootReducer = combineReducers({
  ...cognitoApiReducers,
  ...profileApiReducers,
  ...localityApiReducers,
  ...uploadApiReducers,
  ...postApiReducers,
  ...chatApiReducers,
  ...postBehaviorApiReducers,
  ...connectionApiReducers,
  ...searchApiReducers,
  ...historyApiReducers,
  auth: authReducer,
  userRelationShip: userRelationShipReducer,
  userLocation: userLocationReducer,
  ngoProfileBio: ngoProfileBioReducer,
  userExperiences: userExperiencesReducer,
  ngoProject: ngoProjectReducer,
  userEmails: userEmailsReducer,
  userSocialMedias: userSocialMediasReducer,
  userCertificates: userCertificatesReducer,
  userPersonSkill: userpersonSkillReducer,
  userWebsites: userWebsitesReducer,
  userPhoneNumber: userPhoneNumberReducer,
  userColleges: userCollegesReducer,
  userUniversity: userUniversityReducer,
  userSchools: userSchoolsReducer,
  userMainInfo: userMainInfoReducer,
  ngoPublicDetails: ngoPublicDetailsSlice,
  // product: persistReducer(productPersistConfig, productReducer),
  createSocialPost: createSocialPostReducer,
  sharePost: sharePostReducer,
  sendPost: sendPostReducer,
  homePage: homePageReducer,
  upload: uploadReducer,
  selectMsg: selectMsgReducer,
  allMsg: allMsgReducer,
  selectedUser: selectedUserReducer,
  // followers: followersReducer,
  connectionsList: connectionReducer,
  searchSlice: searchReducer,
  afterRegister: afterRegistration,
});

export { rootPersistConfig, rootReducer };
