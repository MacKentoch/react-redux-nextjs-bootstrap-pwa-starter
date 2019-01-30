// @flow

// #region imports
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import Router, { withRouter } from 'next/router';
import Container from 'reactstrap/lib/Container';
import Button from 'reactstrap/lib/Button';
import * as userAuthActions from '../redux/modules/userAuth';
import Header from '../components/header/Header';
import Private from '../components/privateRoute/PrivateRoute';
// #endregion

// #region flow types
type Props = {
  // from withRouter HOC:
  router: {
    asPath: string,
    pathname: string,
    ...any,
  },

  // userAuth:
  isAuthenticated: boolean,
  disconnectUser: () => any,
  ...any,
};

type State = any;
// #endregion

export class Private1 extends PureComponent<Props, State> {
  // #region component lifecycle methods
  render() {
    const {
      router: { pathname },
    } = this.props;

    return (
      <Private fromPath={pathname}>
        <div>
          <Header />
          <Container>
            <h2>Private1 here</h2>
            <Button color="primary" onClick={this.goBackHome}>
              go back home
            </Button>
          </Container>
        </div>
      </Private>
    );
  }
  // #endregion

  // #region html elements events
  goBackHome = (event: SyntheticEvent<>): void => {
    if (event) {
      event.preventDefault();
    }

    Router.push('/');
  };
  // #endregion
}

// #region redux state and dispatch map to props
const mapStateToProps = (state: any) => ({
  // userAuth:
  isAuthenticated: state.userAuth.isAuthenticated,
});

const mapDispatchToProps = (dispatch: (...any) => any) => {
  return {
    ...bindActionCreators(
      {
        // userAuth:
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
  withRouter,
)(Private1);
