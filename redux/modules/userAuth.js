// @flow

import AppConfig from '../../config/appConfig';
import { type Dispatch, type GetState } from '../../types/redux/redux-thunk';
import userInfosMockData from '../../mock/userInfosMock.json';
import { getLocationOrigin } from '../../utils/fetchTools';
import auth from '../../utils/auth';
import { type State } from '../../types/redux/modules/userAuth';

// #region CONSTANTS
const REQUEST_USER_INFOS_DATA = 'REQUEST_USER_INFOS_DATA';
const RECEIVED_USER_INFOS_DATA = 'RECEIVED_USER_INFOS_DATA';
const ERROR_USER_INFOS_DATA = 'ERROR_USER_INFOS_DATA';

const REQUEST_LOG_USER = 'REQUEST_LOG_USER';
const RECEIVED_LOG_USER = 'RECEIVED_LOG_USER';
const ERROR_LOG_USER = 'ERROR_LOG_USER';

const CHECK_IF_USER_IS_AUTHENTICATED = 'CHECK_IF_USER_IS_AUTHENTICATED';

const DISCONNECT_USER = 'DISCONNECT_USER';
// #endregion

// #region types
type PartialState = $Shape<State>;
type Action = {
  type: | 'REQUEST_USER_INFOS_DATA'
    | 'RECEIVED_USER_INFOS_DATA'
    | 'ERROR_USER_INFOS_DATA'
    | 'REQUEST_LOG_USER'
    | 'RECEIVED_LOG_USER'
    | 'ERROR_LOG_USER'
    | 'CHECK_IF_USER_IS_AUTHENTICATED'
    | 'DISCONNECT_USER',

  payload?: {
    data?: any,
  },
} & PartialState;

// #endregion

// #region REDUCER
const initialState: State = {
  // actions details
  isFetching: false,
  isLogging: false,

  // userInfos
  id: '',
  login: '',
  firstname: '',
  lastname: '',

  token: null,
  isAuthenticated: false, // authentication status (token based auth)
};

export default function(state: State = initialState, action: Action) {
  switch (action.type) {
    case CHECK_IF_USER_IS_AUTHENTICATED: {
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
        token: action.token || initialState.token,
        id: action.user && action.user.id ? action.user.id : initialState.id,
        login:
          action.user && action.user.login
            ? action.user.login
            : initialState.login,
        firstname:
          action.user && action.user.firstname
            ? action.user.firstname
            : initialState.firstname,
        lastname:
          action.user && action.user.lastname
            ? action.user.lastname
            : initialState.firstname,
      };
    }

    case DISCONNECT_USER: {
      return {
        ...state,
        isAuthenticated: false,
        token: initialState.token,
        id: initialState.id,
        login: initialState.login,
        firstname: initialState.firstname,
        lastname: initialState.lastname,
      };
    }

    // user login (get token and userInfo)
    case REQUEST_LOG_USER: {
      return {
        ...state,
        isLogging: true,
      };
    }

    case RECEIVED_LOG_USER: {
      const userLogged = action.payload.data;

      return {
        ...state,
        isAuthenticated: true,
        token: userLogged.token,
        id: userLogged.id,
        login: userLogged.login,
        firstname: userLogged.firstname,
        lastname: userLogged.lastname,
        isLogging: false,
      };
    }

    case ERROR_LOG_USER: {
      return {
        ...state,
        isAuthenticated: false,
        isLogging: false,
      };
    }

    // not used right now:
    case REQUEST_USER_INFOS_DATA: {
      return {
        ...state,
        isFetching: true,
      };
    }

    case RECEIVED_USER_INFOS_DATA: {
      const userInfos = action.payload.data;

      return {
        ...state,
        isFetching: false,
        id: userInfos.id,
        login: userInfos.login,
        firstname: userInfos.firstname,
        lastname: userInfos.lastname,
      };
    }

    case ERROR_USER_INFOS_DATA: {
      return {
        ...state,
        isFetching: false,
      };
    }

    default:
      return state;
  }
}
// #endregion

// #region ACTIONS CREATORS

// #region set user isAuthenticated to false and clear all app localstorage:
export function disconnectUser(): Action {
  auth.clearUserInfo();
  auth.clearToken();
  return { type: DISCONNECT_USER };
}
// #endregion

// #region check if user is connected (by looking at local store)
export function checkUserIsConnected(): Action {
  const token = auth.getToken();
  const user = auth.getUserInfo();
  const checkUserHasId = obj => obj && obj._id;
  const isAuthenticated = token && checkUserHasId(user) ? true : false;

  return {
    type: CHECK_IF_USER_IS_AUTHENTICATED,
    token,
    ...user,
    isAuthenticated,
  };
}
// #endregion

// #region log user
function logUser(login: string, password: string) {
  return async (dispatch: Dispatch<Action>) => {
    const FETCH_TYPE = AppConfig.DEV_MODE ? 'FETCH_MOCK' : 'FETCH';
    const __SOME_LOGIN_API__ = 'login';

    const mockResult = userInfosMockData; // will be fetch_mock data returned (in case FETCH_TYPE = 'FETCH_MOCK', otherwise cata come from server)
    const url = `${getLocationOrigin()}/${__SOME_LOGIN_API__}`;
    const method = 'post';
    const headers = {};
    const options = {
      credentials: 'same-origin',
      data: {
        login,
        password,
      },
    };

    // fetchMiddleware (does: fetch mock, real fetch, dispatch 3 actions... for a minimum code on action creator!)
    return dispatch({
      type: 'FETCH_MIDDLEWARE',
      fetch: {
        // common props:
        type: FETCH_TYPE,
        actionTypes: {
          request: REQUEST_LOG_USER,
          success: RECEIVED_LOG_USER,
          fail: ERROR_LOG_USER,
        },
        // mock fetch props:
        mockResult,
        // real fetch props:
        url,
        method,
        headers,
        options,
      },
    });
  };
}
export function logUserIfNeeded(
  email: string,
  password: string,
): (...any) => Promise<any> {
  return (
    dispatch: Dispatch<Action>,
    getState: GetState<{ userAuth: State }>,
  ): any => {
    if (shouldLogUser(getState())) {
      return dispatch(logUser(email, password));
    }
    return Promise.resolve();
  };
}

function shouldLogUser(state: { userAuth: State }): boolean {
  const { isLogging } = state.userAuth;
  return !isLogging;
}
// #endregion

// #region fetch user info
function fetchUserInfosData(id = '') {
  return (dispatch: Dispatch<Action>) => {
    const token = auth.getToken();
    const FETCH_TYPE = AppConfig.DEV_MODE ? 'FETCH_MOCK' : 'FETCH';

    const mockResult = userInfosMockData; // will be fetch_mock data returned (in case FETCH_TYPE = 'FETCH_MOCK', otherwise cata come from server)
    const url = `${getLocationOrigin()}/${AppConfig.API.users}/${id}`;
    const method = 'get';
    const headers = { authorization: `Bearer ${token || ''}` };
    const options = { credentials: 'same-origin' }; // put options here (see axios options)

    return dispatch({
      type: 'FETCH_MIDDLEWARE',
      fetch: {
        // common props:
        type: FETCH_TYPE,
        actionTypes: {
          request: REQUEST_USER_INFOS_DATA,
          success: RECEIVED_USER_INFOS_DATA,
          fail: ERROR_USER_INFOS_DATA,
        },
        // mock fetch props:
        mockResult,
        // real fetch props:
        url,
        method,
        headers,
        options,
      },
    });
  };
}

export function fetchUserInfoDataIfNeeded(id: string = '') {
  return (
    dispatch: Dispatch<Action>,
    getState: GetState<{ userAuth: State }>,
  ) => {
    if (shouldFetchUserInfoData(getState())) {
      return dispatch(fetchUserInfosData(id));
    }
    return Promise.resolve();
  };
}

function shouldFetchUserInfoData(state: { userAuth: State }): boolean {
  const { isFetching } = state.userAuth;
  return !isFetching;
}
// #endregion

// #endregion
