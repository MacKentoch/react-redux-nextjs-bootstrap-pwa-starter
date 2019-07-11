// @flow

// #region imports
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import auth from '../../utils/auth';
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
  return auth.isExpiredToken(auth.getToken());
}

// #endregiobn

function Private({ fromPath = '/', children }: Props) {
  const { replace } = useRouter();

  useEffect(() => {
    const userIsAuthenticated = checkIsAuthenticated();
    const userTokenExpired = checkIsExpired();
    const RoutePayload = {
      pathname: '/login',
      query: { from: fromPath },
    };

    if (!userIsAuthenticated) {
      replace(RoutePayload);
    }

    if (userTokenExpired) {
      replace(RoutePayload);
    }
  }, []);

  return <div>{children}</div>;
}

// #region statics
Private.displayName = 'Private';
// #endregion

export default Private;
