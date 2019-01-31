// @flow

// #region imports
import App, { Container } from 'next/app';
import { register, unregister } from 'next-offline/runtime';
import React from 'react';
import { Provider } from 'react-redux';
import compose from 'recompose/compose';
import withRedux from 'next-redux-wrapper';
import smoothScrollPolyfill from 'smoothscroll-polyfill';
import configureStore from '../redux/store/configureStore';
import Layout from '../components/layout';
// #endregion

// #region flow types
type Props = any;
// #endregion

// #region globals (styles, polyfill ...)

if (typeof window !== 'undefined') {
  // #region smoothscroll polyfill
  smoothScrollPolyfill.polyfill();
  // forces polyfill (even if browser partially implements it)
  window.__forceSmoothScrollPolyfill__ = true;
  // #endregion
}

// #endregion

export class MyApp extends App<Props> {
  static async getInitialProps({ Component, ctx }: any) {
    return {
      pageProps: {
        // Call page-level getInitialProps
        ...(Component.getInitialProps
          ? await Component.getInitialProps(ctx)
          : {}),
      },
    };
  }

  componentDidMount() {
    register();
  }

  componentWillUnmount() {
    unregister();
  }

  render() {
    const { Component, pageProps, store } = this.props;

    return (
      <Container>
        <Provider store={store}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </Container>
    );
  }
}

export default compose(withRedux(configureStore))(MyApp);
