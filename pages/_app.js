// @flow

// #region imports
import App, { Container } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import compose from 'recompose/compose';
import withRedux from 'next-redux-wrapper';
import configureStore from '../redux/store/configureStore';
// #endregion

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    return {
      pageProps: {
        // Call page-level getInitialProps
        ...(Component.getInitialProps
          ? await Component.getInitialProps(ctx)
          : {}),
      },
    };
  }

  render() {
    const { Component, pageProps, store } = this.props;

    return (
      <Container>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

export default compose(withRedux(configureStore))(MyApp);
