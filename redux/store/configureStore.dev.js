// @flow

import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import reducer from '../modules/reducers';
import fetchMiddleware from '../middleware/fetchMiddleware';

// #region configure logger middleware
const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true,
});
// #endregion

// #region createStore : enhancer
const enhancer = composeWithDevTools(
  applyMiddleware(thunkMiddleware, fetchMiddleware, loggerMiddleware),
);
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
