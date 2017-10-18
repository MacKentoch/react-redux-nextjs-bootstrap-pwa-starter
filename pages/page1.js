// @flow

// #region imports
import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import withRedux              from 'next-redux-wrapper';
import configureStore         from '../redux/store/configureStore';
import * as userAuthActions   from '../redux/modules/userAuth';
import Layout                 from '../components/layout/Layout';
import Header                 from '../components/header/Header';
import Button                 from 'react-bootstrap/lib/Button';
import Router                 from 'next/router';
// #endregion

// #region flow types
type Props = {
  // userAuth:
  isAuthenticated: boolean,
  disconnectUser: () => any,
  ...any
};

type State = any;
// #endregion

class Page1 extends PureComponent<Props, State> {
  // #region component lifecycle methods
  render() {
    return (
      <Layout>
        <Header />
        <h2>
          Page1 here
        </h2>
        <Button
          bsStyle="primary"
          onClick={this.goBackHome}
        >
          go back home
        </Button>
      </Layout>
    );
  }
  // #endregion

  // html elements events
  goBackHome = (
    event: SyntheticEvent<>
  ): void => {
    if (event) {
      event.preventDefault();
    }

    Router.push('/');
  }
  // #endregion
}


// #region redux state and dispatch map to props
const mapStateToProps = (
  state: any
) => ({
  // userAuth:
  isAuthenticated: state.userAuth.isAuthenticated
});

const mapDispatchToProps = (
  dispatch: (...any) => any
) => {
  return {
    ...bindActionCreators(
      {
        // userAuth:
        ...userAuthActions
      },
      dispatch)
  };
};
// #endregion

export default withRedux(
  configureStore,
  mapStateToProps,
  mapDispatchToProps
)(Page1);
