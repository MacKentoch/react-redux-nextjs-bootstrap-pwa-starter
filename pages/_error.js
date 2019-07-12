// @flow

import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Jumbotron from 'reactstrap/lib/Jumbotron';
import { type GetInitialPropsParams } from '../types/nextjs';
import appConfig from '../config/appConfig';

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

// #region constants
const {
  og: { description: ogDescription, locale: ogLang },
  seo: { description: seoDescription },
} = appConfig.metas;
// #endregion

// #region styled components
const Page = styled.div``;
// #endregion

export function Error({ errorCode = null }: Props) {
  return (
    <Page>
      <Head>
        <title>Error...</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:locale" content={ogLang} />
      </Head>
      <Jumbotron>
        <h1>Sorry but this time... It threw an error...</h1>
        <code>Error code: {errorCode ? errorCode : '--'}</code>
      </Jumbotron>
    </Page>
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
