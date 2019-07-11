// @flow

// #region imports
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import Router from 'next/router';
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

class Private1 extends PureComponent<Props, State> {
  static async getInitialProps({ pathname, query }) {
    return { pathname, query };
  }

  // #region component lifecycle methods
  render() {
    const { pathname } = this.props;

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
    event && event.preventDefault();
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
)(Private1);
