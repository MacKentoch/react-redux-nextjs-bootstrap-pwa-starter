// @flow weak

import {
  createStore,
  applyMiddleware
}                               from 'redux';
import { createLogger }         from 'redux-logger';
import thunkMiddleware          from 'redux-thunk';
import {
  persistStore,
  autoRehydrate
}                               from 'redux-persist';
import { composeWithDevTools }  from 'redux-devtools-extension';
import reducer                  from '../modules/reducers';
import fetchMiddleware          from '../middleware/fetchMiddleware';

// #region configure logger middleware
const loggerMiddleware = createLogger({
  level:      'info',
  collapsed:  true
});
// #endregion

// #region createStore : enhancer
const enhancer = composeWithDevTools(
  applyMiddleware(
    thunkMiddleware,
    fetchMiddleware,
    loggerMiddleware,
  ),
  autoRehydrate()
);
// #endregion

// #region store initialization
export default function configureStore(initialState) {
  const store = createStore(reducer, initialState, enhancer);

  // begin periodically persisting the store
  persistStore(store);

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
