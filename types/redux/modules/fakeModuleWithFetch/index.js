// @flow

// @flow

// #region imports

// #endregion

export type State = {
  isFetching: boolean,
  actionTime: string,
  data: Array<any>,
  error: ?any,

  ...any,
};

export type FakeModuleWithFetchActions = {
  fakeFetchIfNeeded: () => Promise<any>,
};
