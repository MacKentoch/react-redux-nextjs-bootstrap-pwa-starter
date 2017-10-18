// @flow

import { combineReducers }  from 'redux';
import fakeModuleWithFetch  from './fakeModuleWithFetch';
import userAuth             from './userAuth';
import persistStore         from './persistStore';

export const reducers = {
  fakeModuleWithFetch,
  userAuth,
  persistStore
};

export default combineReducers({
  ...reducers
});
