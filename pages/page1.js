// @flow

// #region imports
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import Button from 'reactstrap/lib/Button';
import Router from 'next/router';
import Container from 'reactstrap/lib/Container';
import * as userAuthActions from '../redux/modules/userAuth';
import Header from '../components/header/Header';
// #endregion

// #region flow types
type Props = {
  // userAuth:
  isAuthenticated: boolean,
  disconnectUser: () => any,
  ...any,
};

type State = any;
// #endregion

class Page1 extends PureComponent<Props, State> {
  // #region component lifecycle methods
  render() {
    return (
      <div>
        <Header />
        <Container>
          <h2>Page1 here</h2>
          <Button color="primary" onClick={this.goBackHome}>
            go back home
          </Button>
        </Container>
      </div>
    );
  }
  // #endregion

  // html elements events
  goBackHome = (event: SyntheticEvent<>): void => {
    event && event.preventDefault();
    Router.push('/');
  };
  // #endregion
}

// #region redux state and dispatch map to props
const mapStateToProps = (state: any) => ({
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
)(Page1);
