// @flow

// #region imports
import { REHYDRATE } from 'redux-persist/constants';
// #endregion

const initialState = {};

/**
 * redux-persist reducer rehydration logic
 *
 * NOTE: you need to write on your own!!!
 *
 * @export
 * @param {any} [state=initialState] state
 * @param {any} action action
 * @returns {any} state
 */
export default function (state = initialState, action) {
  switch (action.type) {
  case REHYDRATE: {
    const incoming = action.payload.myReducer;
    if (incoming) {
      return {
        ...state,
        ...incoming
        //  specialKey: processSpecial(incoming.specialKey)
      };
    }
    return state;
  }

  default:
    return state;
  }
}
// #endregion
