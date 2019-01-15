// @flow

// #region imports
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import * as userAuthActions from '../redux/modules/userAuth';
import Header from '../components/header/Header';
import Button from 'react-bootstrap/lib/Button';
import Router from 'next/router';
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
        <h2>Page1 here</h2>
        <Button bsStyle="primary" onClick={this.goBackHome}>
          go back home
        </Button>
      </div>
    );
  }
  // #endregion

  // html elements events
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
)(Page1);
