// @flow

import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Head from 'next/head';
import Container from 'reactstrap/lib/Container';
import Jumbotron from 'reactstrap/lib/Jumbotron';
import Button from 'reactstrap/lib/Button';
import Header from '../../components/header';
import appConfig from '../../config/appConfig';

// #region types
type Props = {
  counter: number,
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

export function DynamicPage({ isFetching }: Props) {
  const { push, query } = useRouter();
  const { counter = 0 } = query;

  // # region callbacks
  const goHome = useCallback((event: SyntheticEvent<>) => {
    event && event.preventDefault();
    push('/');
  }, []);
  // #endregion

  return (
    <Page>
      <Head>
        <title>Dynamic page #{counter}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:locale" content={ogLang} />
      </Head>
      <Header />
      <Container fluid>
        <Jumbotron>
          <h1>Dynamic page #{counter}</h1>
          <Button onClick={goHome}>go back home</Button>
        </Jumbotron>
      </Container>
    </Page>
  );
}

// #region statics
DynamicPage.displayName = 'DynamicPage';
// #endregion

// #region redux
const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators({}, dispatch),
  };
};
// #endregion

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(DynamicPage);
