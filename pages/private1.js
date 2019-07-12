// @flow

import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { useRouter } from 'next/router';
import Container from 'reactstrap/lib/Container';
import Button from 'reactstrap/lib/Button';
import * as userAuthActions from '../redux/modules/userAuth';
import Header from '../components/header';
import Private from '../components/privateRoute';
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

export function Private1({  }: Props) {
  const { asPath, push } = useRouter();

  // #region callbacks
  const goBackHome = (event: SyntheticEvent<>): void => {
    event && event.preventDefault();
    push('/');
  };
  // #endregion

  return (
    <Private fromPath={asPath}>
      <Page>
        <Head>
          <title>Private page1</title>
          <meta name="description" content={seoDescription} />
          <meta property="og:description" content={ogDescription} />
          <meta property="og:locale" content={ogLang} />
        </Head>
        <Header />
        <Container>
          <h2>Private1 here</h2>
          <Button color="primary" onClick={goBackHome}>
            go back home
          </Button>
        </Container>
      </Page>
    </Private>
  );
}

// #region statics
Private1.displayName = 'Private1';
// #nedregion

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
)(Private1);
