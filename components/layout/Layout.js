// @flow

// #region imports
import { PureComponent }  from 'react';
import Head               from 'next/head';
// #endregion

// #region flow types
type Props = {
  children: ReactNode
}

type State = any;
// #endregion

class Layout extends PureComponent<Props, State> {
  // #region component lifecycle methods
  render() {
    const { children } = this.props;

    return (
      <div>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/cosmo/bootstrap.min.css" />
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
          <link rel="apple-touch-icon" sizes="180x180" href="static/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="static/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="static/favicon-16x16.png" />
          <link rel="manifest" href="static/manifest.json" />
          <link rel="mask-icon" href="static/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="apple-mobile-web-app-title" content="react-redux-nextjs-bootstrap-pwa-starter" />
          <meta name="application-name" content="react-redux-nextjs-bootstrap-pwa-starter" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <style
          jsx
          global
        >
          {`
            body {
            }

            .navbar {
              border-radius: 0;
            }
          `}
        </style>
        {children}
      </div>
    );
  }
  // #endregion
}

export default Layout;
