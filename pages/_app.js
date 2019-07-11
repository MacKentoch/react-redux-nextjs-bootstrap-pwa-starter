// @flow

import React from 'react';
import App, { Container } from 'next/app';
import { register, unregister } from 'next-offline/runtime';
import { Provider } from 'react-redux';
import { compose } from 'redux';
import { ThemeProvider } from 'styled-components';
import withRedux from 'next-redux-wrapper';
import smoothScrollPolyfill from 'smoothscroll-polyfill';
import configureStore from '../redux/store/configureStore';
import Layout from '../components/layout';
import { theme } from '../config/theme';

// #region types
type Props = any;
// #endregion

// #region constants
const store = configureStore();

if (typeof window !== 'undefined') {
  // #region smoothscroll polyfill
  smoothScrollPolyfill.polyfill();
  // forces polyfill (even if browser partially implements it)
  window.__forceSmoothScrollPolyfill__ = true;
  // #endregion
}
// #endregion

class MyApp extends App<Props, any> {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  componentDidMount() {
    register();
  }

  componentWillUnmount() {
    unregister();
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Provider>
        </ThemeProvider>
      </Container>
    );
  }
}

MyApp.displayName = 'MyApp';

export default compose(withRedux(configureStore))(MyApp);
