// @flow

import React from 'react';
import Jumbotron from 'reactstrap/lib/Jumbotron';
import { type GetInitialPropsParams } from '../types/nextjs';

// #region types
type Props = {
  errorCode?: number,
};

type NextInitialProps = {
  res?: {
    statusCode: number,
  },
  xhr: {
    status: number,
  },
};
// #endregion

function Error({ errorCode = null }: Props) {
  return (
    <Jumbotron>
      <h1>Sorry but this time... It threw an error...</h1>
      <code>Error code: {errorCode ? errorCode : '--'}</code>
    </Jumbotron>
  );
}

Error.getInitialProps = async function({
  res,
  xhr,
}: GetInitialPropsParams & NextInitialProps) {
  const errorCode = res ? res.statusCode : xhr.status;
  return { errorCode };
};

Error.displayName = 'Error';

export default Error;
