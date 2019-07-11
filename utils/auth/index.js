// @flow

import decode from 'jwt-decode';
import isAfter from 'date-fns/is_after';

// #region types
export type STORES_TYPES = 'localStorage' | 'sessionStorage';
export type Storage = STORES_TYPES;
export type TokenKey = string;
export type UserInfoKey = string;
// #endregion

// #region constants
const TOKEN_KEY = 'token';
const USER_INFO = 'userInfo';

const APP_PERSIST_STORES_TYPES: Array<STORES_TYPES> = [
  'localStorage',
  'sessionStorage',
];

const parse = JSON.parse;
const stringify = JSON.stringify;
const localStorage = typeof window === 'undefined' ? null : window.localStorage;
const sessionStorage =
  typeof window === 'undefined' ? null : window.sessionStorage;
// #endregion

/*
  auth object
  -> store "TOKEN_KEY"
  - default storage is "localStorage"
  - default token key is 'token'
 */
export const auth = {
  // /////////////////////////////////////////////////////////////
  // TOKEN
  // /////////////////////////////////////////////////////////////

  /**
   * get token from localstorage
   *
   * @param {'localStorage' | 'sessionStorage'} [fromStorage='localStorage'] specify storage
   * @param {any} [tokenKey=TOKEN_KEY]  optionnal parameter to specify a token key
   * @returns {string} token value
   */
  getToken(
    fromStorage: Storage = APP_PERSIST_STORES_TYPES[0],
    tokenKey: TokenKey = TOKEN_KEY,
  ): ?string {
    if (typeof window === 'undefined') {
      return;
    }

    // localStorage:
    if (fromStorage === APP_PERSIST_STORES_TYPES[0]) {
      return (localStorage && localStorage.getItem(tokenKey)) || null;
    }
    // sessionStorage:
    if (fromStorage === APP_PERSIST_STORES_TYPES[1]) {
      return (sessionStorage && sessionStorage.getItem(tokenKey)) || null;
    }
    // default:
    return null;
  },

  /**
   * set the token value into localstorage (managed by localforage)
   *
   * @param {string} [value=''] token value
   * @param {'localStorage' | 'sessionStorage'} [toStorage='localStorage'] specify storage
   * @param {any} [tokenKey='token'] token key
   * @returns {boolean} success/failure flag
   */
  setToken(
    value: string = '',
    toStorage: Storage = APP_PERSIST_STORES_TYPES[0],
    tokenKey: TokenKey = TOKEN_KEY,
  ): ?string {
    if (!value || value.length <= 0) {
      return;
    }

    if (typeof window === 'undefined') {
      return '';
    }

    // localStorage:
    if (toStorage === APP_PERSIST_STORES_TYPES[0]) {
      if (localStorage) {
        localStorage.setItem(tokenKey, value);
      }
    }
    // sessionStorage:
    if (toStorage === APP_PERSIST_STORES_TYPES[1]) {
      if (sessionStorage) {
        sessionStorage.setItem(tokenKey, value);
      }
    }
  },

  /**
   * check
   * - if token key contains a valid token value (defined and not an empty value)
   * - if the token expiration date is passed
   *
   *
   * Note: 'isAuthenticated' just checks 'tokenKey' on store (localStorage by default or sessionStorage)
   *
   * You may think: 'ok I just put an empty token key and I have access to protected routes?''
   *    -> answer is:  YES^^
   * BUT
   * -> : your backend will not recognize a wrong token so private data or safe and you protected view could be a bit ugly without any data.
   *
   * => ON CONCLUSION: this aim of 'isAuthenticated'
   *    -> is to help for a better "user experience"  (= better than displaying a view with no data since server did not accept the user).
   *    -> it is not a security purpose (security comes from backend, since frontend is easily hackable => user has access to all your frontend)
   *
   * @param {'localStorage' | 'sessionStorage'} [fromStorage='localStorage'] specify storage
   * @param {any} [tokenKey=TOKEN_KEY] token key
   * @returns {bool} is authenticed response
   */
  isAuthenticated(
    fromStorage: Storage = APP_PERSIST_STORES_TYPES[0],
    tokenKey: TokenKey = TOKEN_KEY,
  ): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    // localStorage:
    if (fromStorage === APP_PERSIST_STORES_TYPES[0]) {
      if (localStorage && localStorage.getItem(tokenKey)) {
        return true;
      } else {
        return false;
      }
    }
    // sessionStorage:
    if (fromStorage === APP_PERSIST_STORES_TYPES[1]) {
      if (sessionStorage && sessionStorage.getItem(tokenKey)) {
        return true;
      } else {
        return false;
      }
    }
    // default:
    return false;
  },

  /**
   * delete token
   *
   * @param {any} [tokenKey='token'] token key
   * @returns {bool} success/failure flag
   */
  clearToken(
    storage: Storage = APP_PERSIST_STORES_TYPES[0],
    tokenKey: TokenKey = TOKEN_KEY,
  ): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    // localStorage:
    if (localStorage && localStorage[tokenKey]) {
      localStorage.removeItem(tokenKey);
      return true;
    }
    // sessionStorage:
    if (sessionStorage && sessionStorage[tokenKey]) {
      sessionStorage.removeItem(tokenKey);
      return true;
    }

    return false;
  },

  /**
   * return expiration date from token
   *
   * @param {string} encodedToken - base 64 token received from server and stored in local storage
   * @returns {date | null} returns expiration date or null id expired props not found in decoded token
   */
  getTokenExpirationDate(encodedToken: any): Date {
    if (typeof window === 'undefined') {
      return new Date(0);
    }

    if (!encodedToken) {
      return new Date(0); // is expired
    }

    const token = decode(encodedToken);
    if (!token.exp) {
      return new Date(0); // is expired
    }

    const expirationDate = new Date(token.exp * 1000);
    return expirationDate;
  },

  /**
   * tell is token is expired (compared to now)
   *
   * @param {string} encodedToken - base 64 token received from server and stored in local storage
   * @returns {bool} returns true if expired else false
   */
  isExpiredToken(encodedToken: any): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const expirationDate = this.getTokenExpirationDate(encodedToken);
    const rightNow = new Date();
    const isExpiredToken = isAfter(rightNow, expirationDate);

    return isExpiredToken;
  },

  // /////////////////////////////////////////////////////////////
  // USER_INFO
  // /////////////////////////////////////////////////////////////
  /**
   * get user info from localstorage
   *
   * @param {'localStorage' | 'sessionStorage'} [fromStorage='localStorage'] specify storage
   * @param {any} [userInfoKey='userInfo']  optionnal parameter to specify a token key
   * @returns {string} token value
   */
  getUserInfo(
    fromStorage: Storage = APP_PERSIST_STORES_TYPES[0],
    userInfoKey: UserInfoKey = USER_INFO,
  ): ?string {
    if (typeof window === 'undefined') {
      return;
    }

    // localStorage:
    if (fromStorage === APP_PERSIST_STORES_TYPES[0]) {
      return (localStorage && parse(localStorage.getItem(userInfoKey))) || null;
    }
    // sessionStorage:
    if (fromStorage === APP_PERSIST_STORES_TYPES[1]) {
      return (
        (sessionStorage && parse(sessionStorage.getItem(userInfoKey))) || null
      );
    }
    // default:
    return null;
  },

  /**
   * set the userInfo value into localstorage
   *
   * @param {object} [value=''] token value
   * @param {'localStorage' | 'sessionStorage'} [toStorage='localStorage'] specify storage
   * @param {any} [userInfoKey='userInfo'] token key
   * @returns {boolean} success/failure flag
   */
  setUserInfo(
    value: string = '',
    toStorage: Storage = APP_PERSIST_STORES_TYPES[0],
    userInfoKey: UserInfoKey = USER_INFO,
  ): any {
    if (typeof window === 'undefined') {
      return;
    }

    if (!value || value.length <= 0) {
      return;
    }
    // localStorage:
    if (toStorage === APP_PERSIST_STORES_TYPES[0]) {
      if (localStorage) {
        localStorage.setItem(userInfoKey, stringify(value));
      }
    }
    // sessionStorage:
    if (toStorage === APP_PERSIST_STORES_TYPES[1]) {
      if (sessionStorage) {
        sessionStorage.setItem(userInfoKey, stringify(value));
      }
    }
  },

  /**
   * delete userInfo
   *
   * @param {string} [userInfoKey='userInfo'] token key
   * @returns {bool} success/failure flag
   */
  clearUserInfo(userInfoKey: UserInfoKey = USER_INFO): any {
    if (typeof window === 'undefined') {
      return;
    }

    // localStorage:
    if (localStorage && localStorage[userInfoKey]) {
      localStorage.removeItem(userInfoKey);
    }
    // sessionStorage:
    if (sessionStorage && sessionStorage[userInfoKey]) {
      sessionStorage.removeItem(userInfoKey);
    }
  },

  // /////////////////////////////////////////////////////////////
  // COMMON
  // /////////////////////////////////////////////////////////////
  /**
   * tells if current browser supports localStorage (as an example: iOS Safari with cookies disabled would not!)
   * @return {boolean} browser supports localStorage flag
   */
  supportsLocalStorage(): boolean {
    if (typeof window === 'undefined') {
      throw new Error(
        'supportsLocalStorage should be launched on browser (not on server)',
      );
    }

    try {
      const localStorageSupported =
        'localStorage' in window && window.localStorage !== null;
      return localStorageSupported;
    } catch (error) {
      return false;
    }
  },

  /**
   * tells if current browser supports localStorage (as an example: iOS Safari with cookies disabled would not!)
   * @return {boolean} browser supports localStorage flag
   */
  supportsSessionStorage(): boolean {
    if (typeof window === 'undefined') {
      throw new Error(
        'supportsSessionStorage should be launched on browser side (not on server side)',
      );
    }

    try {
      const sessionStorageSupported =
        'sessionStorage' in window && window.sessionStorage !== null;
      return sessionStorageSupported;
    } catch (error) {
      return false;
    }
  },

  /**
   * forget me method: clear all
   * @returns {bool} success/failure flag
   */
  clearAllAppStorage(): any {
    if (typeof window === 'undefined') {
      return;
    }

    if (localStorage) {
      localStorage.clear();
    }
    if (sessionStorage) {
      sessionStorage.clear();
    }
  },
};

export default auth;
