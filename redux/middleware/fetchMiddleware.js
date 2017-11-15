// @flow

// #region imports
import axios  from 'axios';
// #endregion

// #region constants
export const FETCH_MOCK = 'FETCH_MOCK';
export const FETCH      = 'FETCH';
// #endregion

// #region flow type
type Fetch = {
  // real and mock fetch properties:
  type: 'FETCH_MOCK' | 'FETCH', // choose between real fetch or just mock fetch (will return mockResult in thta case)
  actionTypes: {
    request: string, // action for request fetch
    success: string, // action for successul fetch
    fail: string // action for failed fetch
  },

  // real fetch properties:
  url?: string, // real fetch url
  method?: 'get' | 'post' | 'put' | 'delete', // verb
  headers?: any, // OPTIONAL CONTENT like: data: { someprop: 'value ...}
  options?: {
    credentials?: string, // ex: 'same-origin
    data?: any // payload
  }, // OPTIONAL CONTENT like: Authorization: 'Bearer _A_TOKEN_'

  // mock fetch propperties:
  mockResult?: any,  // payload returned when type === 'FETCH_MOCK'
};

type Action = {
  fetch?: Fetch,  // fetch middleware payload
  ...any
};
// #endregion

// //////////////////////////////
// ###### HOW TO USE
// //////////////////////////////
// CASE: FETCH_MOCK mode
// in any action just add fetch object like:
// {
//  fetch: {
//    type: 'FETCH_MOCK',
//    actionTypes: {
//      request: 'TYPE_FOR_REQUEST',
//      success: 'TYPE_FOR_RECEIVED',
//      fail: 'TYPE_FOR_ERROR',
//    },
//    mockResult: any
//  }
// }
//
// ---------------------------
// CASE: FETCH mode
// in any action just add fetch object like:
// {
//  fetch: {
//    type: 'FETCH',
//    actionTypes: {
//      request: 'TYPE_FOR_REQUEST',
//      success: 'TYPE_FOR_RECEIVED',
//      fail: 'TYPE_FOR_ERROR',
//    },
//    url: 'an url',
//    method: 'get',  // lower case, one of 'get', 'post'...
//    headers: {}     // OPTIONAL CONTENT like: data: { someprop: 'value ...}
//    options: {}     // OPTIONAL CONTENT like: Authorization: 'Bearer _A_TOKEN_'
//  }
// }
//

// #region middleware function
const fetchMiddleware = store => next => (action: Action) => {
  if (!action.fetch) {
    return next(action);
  }

  if (!action.fetch.type ||
      !action.fetch.type === FETCH_MOCK ||
      !action.fetch.type === FETCH) {
    return next(action);
  }

  if (!action.fetch.actionTypes) {
    return next(action);
  }

  /**
   * fetch mock
   * @type {[type]}
   */
  if (action.fetch.type === FETCH_MOCK) {
    if (!action.fetch.mockResult) {
      throw new Error('Fetch middleware require a mockResult payload when type is "FETCH_MOCK"');
    }

    const {
      actionTypes: {request, success},
      mockResult
    } = action.fetch;

    // request
    store.dispatch({ type: request });

    // received successful for mock
    return Promise.resolve(
      store.dispatch({
        type:     success,
        payload:  {
          status: 200,
          data: mockResult
        }
      })
    );
  }

  if (action.fetch.type === FETCH) {
    const {
      actionTypes: {request, success, fail},
      url,
      method,
      headers,
      options
    } = action.fetch;

    // request
    store.dispatch({ type: request });

    // fetch server (success or fail)
    // returns a Promise
    return axios.request({
      method,
      url,
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Acces-Control-Allow-Origin': '*',
        ...headers
      },
      ...options
    })
      .then(data => store.dispatch({type: success, payload: data}))
      .catch(
        err => {
          store.dispatch({type: fail, error: err.response});
          return Promise.reject(err.response);
        }
      );
  }
  return next(action);
};
// #endregion

export default fetchMiddleware;
