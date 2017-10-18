// @flow

// #region imports
import { PureComponent }  from 'react';
import Router             from 'next/router';
import auth               from '../../services/auth';
// #endregion

// #region flow types
type Props = {
  fromPath: string,
  children: ReactNode
}

type State = any;
// #endregion

class Private extends PureComponent<Props, State> {
  // #region
  static defaultProps = {
    fromPath: '/'
  };

  // #region component lifecycle methods
  componentDidMount() {
    const {
      fromPath
    } = this.props;

    const userIsAuthenticated = this.isAuthenticated();
    const userTokenExpired =this.isExpired();

    const RoutePayload = {
      pathname: '/login',
      query: { from: fromPath }
    };

    if (!userIsAuthenticated) {
      return Router.replace(RoutePayload);
    }

    if (userTokenExpired) {
      return Router.replace(RoutePayload);
    }

    return true;
  }

  render() {
    const { children } = this.props;

    return (
      <div>
        {children}
      </div>
    );
  }
  // #endregion

  // #region authentication check methods
  isAuthenticated(): boolean {
    const checkUserHasId  = user => user && user.id;
    const user            = auth.getUserInfo() ? auth.getUserInfo() : null;
    const isAuthenticated = auth.getToken() && checkUserHasId(user) ? true : false;
    return isAuthenticated;
  }

  isExpired(): boolean {
    /* eslint-disable no-console */
    // comment me:
    console.log('token expires: ', auth.getTokenExpirationDate(auth.getToken()));
    /* eslint-enable no-console */
    return auth.isExpiredToken(auth.getToken());
  }
  // #endregion
}

export default Private;
