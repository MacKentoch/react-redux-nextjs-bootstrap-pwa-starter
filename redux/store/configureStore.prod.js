// @flow weak

import {
  createStore,
  compose,
  applyMiddleware
}                               from 'redux';
import thunkMiddleware          from 'redux-thunk';
import {
  persistStore,
  autoRehydrate
}                               from 'redux-persist';
import localForage              from 'localforage';
import reducer                  from '../modules/reducers';
import fetchMiddleware          from '../middleware/fetchMiddleware';

// #region createStore : enhancer
const enhancer = compose(
  applyMiddleware(
    thunkMiddleware,
    fetchMiddleware
  ),
  autoRehydrate()
);
// #endregion

// #region store initialization
export default function configureStore(initialState) {
  const store = createStore(reducer, initialState, enhancer);

  // begin periodically persisting the store
  persistStore(store, {storage: localForage});

  // OPTIONAL: you can blacklist reducers to avoid them to persist, so call
  // persistStore(
  //   store,
  //   {blacklist: ['someTransientReducer']},
  //   () => {
  //   console.log('rehydration complete')
  //   }
  // );

  return store;
}
// #endregion
