// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import Container from 'reactstrap/lib/Container';
import Jumbotron from 'reactstrap/lib/Jumbotron';
import Button from 'reactstrap/lib/Button';
import Router from 'next/router';
import * as fakeFetchActions from '../redux/modules/fakeModuleWithFetch';
import * as userAuthActions from '../redux/modules/userAuth';
import Header from '../components/header/Header';

// #region types
type Props = {
  // fakeModuleWithFetch:
  isFetching: boolean,
  fakeData: any,
  fakeFetchIfNeeded: () => Promise<any>,
  // userAuth:
  isAuthenticated: boolean,
  disconnectUser: () => any,
  ...any,
};

type InitialProps = {
  req: any,
  res: any,
  pathname: string,
  query: any,
  asPath: string,
  isServer: boolean,
  store?: any,
  ...any,
};
// #endregion

class Index extends PureComponent<Props, any> {
  // #region props initialization
  static async getInitialProps({ isServer, store }: InitialProps) {
    const SIDE = isServer ? 'SERVER SIDE' : 'FRONT SIDE';

    try {
      const response = await store.dispatch(
        fakeFetchActions.fakeFetchIfNeeded(),
      );
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
  }
  // #endregion

  // #region component lifecycle methods
  render() {
    return (
      <div>
        <Header />
        <Container fluid>
          <Jumbotron>
            <h1>PWA: Next JS + Redux + Bootstrap STARTER</h1>
            <Button color="primary" onClick={this.goLogin}>
              login
            </Button>
          </Jumbotron>
        </Container>
      </div>
    );
  }
  // #endregion

  // # region go login click
  goLogin = (event: SyntheticEvent<>) => {
    event && event.preventDefault();
    Router.push('/login');
  };
  // #endregion
}

// #region redux state and dispatch map to props
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
)(Index);
