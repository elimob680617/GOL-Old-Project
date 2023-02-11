import { configureStore } from '@reduxjs/toolkit';
import { useDispatch as useAppDispatch, useSelector as useAppSelector, TypedUseSelectorHook } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import { rootPersistConfig, rootReducer } from './rootReducer';
import { rtkQueryErrorLogger } from './errorMiddleware';
// middlewares
// import { middleware as cognitoMiddleware } from './COGNITOAPIs';
// import { middleware as profileMiddleware } from './PROFILEAPIs';
// import { middleware as postMiddleware } from './POSTAPIs';
// ----------------------------------------------------------------------

const store = configureStore({
  reducer: persistReducer(rootPersistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(rtkQueryErrorLogger),
  // .concat(...cognitoMiddleware)
  // .concat(...profileMiddleware)
  // .concat(...postMiddleware),
});

const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof rootReducer>;

const { dispatch } = store;

const useDispatch = () => useAppDispatch<AppDispatch>();

const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;

export { store, persistor, dispatch, useDispatch, useSelector };
