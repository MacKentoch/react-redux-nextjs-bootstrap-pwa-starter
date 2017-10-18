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
import Private                from '../components/privateRoute/PrivateRoute';
// #endregion

// #region flow types
type Props = {
  // from next/Router:
  url: {
    asPath: string,
    pathname: string,
    ...any
  },

  // userAuth:
  isAuthenticated: boolean,
  disconnectUser: () => any,
  ...any
};

type State = any;
// #endregion

class Private1 extends PureComponent<Props, State> {
  // #region component lifecycle methods
  render() {
    const {
      url: {
        pathname
      }
    } = this.props;

    return (
      <Private
        fromPath={pathname}
      >
        <Layout>
          <Header />
          <h2>
            Private1 here
          </h2>
          <Button
            bsStyle="primary"
            onClick={this.goBackHome}
          >
            go back home
          </Button>
        </Layout>
      </Private>
    );
  }
  // #endregion

  // #region html elements events
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
)(Private1);
