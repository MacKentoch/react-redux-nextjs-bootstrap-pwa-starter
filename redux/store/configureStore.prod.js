// @flow

import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import reducer from '../modules/reducers';
import fetchMiddleware from '../middleware/fetchMiddleware';

// #region createStore : enhancer
const enhancer = compose(applyMiddleware(thunkMiddleware, fetchMiddleware));
// #endregion

// #region persisted reducer
const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);
// #endregion

// #region store initialization
export default function configureStore(initialState) {
  const store = createStore(persistedReducer, initialState, enhancer);

  // we won't need PersistGate since server rendered with nextJS:
  // const persistor = persistStore(store);
  // return { store, persistor };

  return store;
}
// #endregion
