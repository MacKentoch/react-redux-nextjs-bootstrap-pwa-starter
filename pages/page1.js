// @flow

import React from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { bindActionCreators, compose } from 'redux';
import styled from 'styled-components';
import Container from 'reactstrap/lib/Container';
import Button from 'reactstrap/lib/Button';
import Header from '../components/header';
import * as userAuthActions from '../redux/modules/userAuth';
import appConfig from '../config/appConfig';

// #region types
type Props = {
  // userAuth:
  isAuthenticated: boolean,
  disconnectUser: () => any,
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

export function Page1({  }: Props) {
  const { push } = useRouter();

  // #region callbacks
  const goBackHome = (event: SyntheticEvent<>): void => {
    event && event.preventDefault();
    push('/');
  };
  // #endregion

  return (
    <Page>
      <Head>
        <title>Page 1</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:locale" content={ogLang} />
      </Head>
      <Header />
      <Container>
        <h2>Page1 here</h2>
        <Button color="primary" onClick={goBackHome}>
          go back home
        </Button>
      </Container>
    </Page>
  );
}

// #region statics
Page1.displayName = 'Page1';
// #endregion

// #region redux
const mapStateToProps = state => ({
  isAuthenticated: state.userAuth.isAuthenticated,
});

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators({ ...userAuthActions }, dispatch),
  };
};
// #endregion

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Page1);
