// @flow

// #region imports
import React, { PureComponent, useEffect } from 'react';
import Router from 'next/router';
import auth from '../../services/auth';
// #endregion

// #region flow types
type Props = {
  fromPath: string,
  children: any,
};
// #endregion

// #region constants
function checkIsAuthenticated(): boolean {
  // $FlowIgnore
  const checkUserHasId = user => user && user.id;
  const user = auth.getUserInfo() ? auth.getUserInfo() : null;
  const isAuthenticated =
    auth.getToken() && checkUserHasId(user) ? true : false;
  return isAuthenticated;
}

function checkIsExpired(): boolean {
  /* eslint-disable no-console */
  // comment me:
  console.log('token expires: ', auth.getTokenExpirationDate(auth.getToken()));
  /* eslint-enable no-console */
  return auth.isExpiredToken(auth.getToken());
}

// #endregiobn

function Private({ fromPath, children }: Props) {
  useEffect(() => {
    const userIsAuthenticated = checkIsAuthenticated();
    const userTokenExpired = checkIsExpired();
    const RoutePayload = {
      pathname: '/login',
      query: { from: fromPath },
    };

    if (!userIsAuthenticated) {
      Router.replace(RoutePayload);
    }

    if (userTokenExpired) {
      Router.replace(RoutePayload);
    }
  });

  return <div>{children}</div>;
}

Private.defaultProps = {
  fromPath: '/',
};

Private.displayName = 'Private';

export default Private;
