// @flow

import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { useRouter } from 'next/router';
import Container from 'reactstrap/lib/Container';
import Jumbotron from 'reactstrap/lib/Jumbotron';
import Button from 'reactstrap/lib/Button';
import * as fakeFetchActions from '../redux/modules/fakeModuleWithFetch';
import * as userAuthActions from '../redux/modules/userAuth';
import Header from '../components/header/Header';
import { type GetInitialPropsParams } from '../types/nextjs';

// #region types
type Props = {
  // fakeModuleWithFetch:
  isFetching: boolean,
  fakeData: any,
  fakeFetchIfNeeded: () => Promise<any>,
  // userAuth:
  isAuthenticated: boolean,
  disconnectUser: () => any,
};
// #endregion

function IndexPage({ isFetching }: Props) {
  const { push } = useRouter();

  // # region callbacks
  const goLogin = useCallback((event: SyntheticEvent<>) => {
    event && event.preventDefault();
    push('/login');
  }, []);
  // #endregion

  return (
    <div>
      <Header />
      <Container fluid>
        <Jumbotron>
          <h1>PWA: Next JS + Redux + Bootstrap STARTER</h1>
          <Button color="primary" onClick={goLogin}>
            login
          </Button>
        </Jumbotron>
      </Container>
    </div>
  );
}

// #region statics
IndexPage.getInitialProps = async function({
  isServer,
  store,
}: GetInitialPropsParams) {
  const SIDE = isServer ? 'SERVER SIDE' : 'FRONT SIDE';

  try {
    const response = await store.dispatch(fakeFetchActions.fakeFetchIfNeeded());
    const {
      payload: { data },
    } = response;
    // NOTE: you will see this log in your server console (where you `npm run dev`):
    /* eslint-disable no-console */
    console.log(`getInitialProps - ${SIDE} - fake fetch result: `, data);
  } catch (error) {
    console.error(`getInitialProps - ${SIDE} - fake fetch failed: `, error);
    /* eslint-enable no-console */
  }
};

IndexPage.displayName = 'IndexPage';
// #endregion

// #region redux
const mapStateToProps = (state: any) => ({
  // fakeModuleWithFetch:
  isFetching: state.fakeModuleWithFetch.isFetching,
  fakeData: state.fakeModuleWithFetch.data,
  // userAuth:
  isAuthenticated: state.userAuth.isAuthenticated,
});

const mapDispatchToProps = (dispatch: (...any) => any) => {
  return {
    ...bindActionCreators(
      {
        ...fakeFetchActions,
        ...userAuthActions,
      },
      dispatch,
    ),
  };
};
// #endregion

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(IndexPage);
