// @flow

export type State = {
  ...any,
};

export type FakeModuleWithFetchActions = {
  fakeFetchIfNeeded: () => Promise<any>,
};
