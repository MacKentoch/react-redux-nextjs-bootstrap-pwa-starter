// @flow
/* eslint-disable quotes */

import React, { useEffect } from 'react';
import Head from 'next/head';
import theme from '../../config/theme';
import appConfig from '../../config/appConfig';
import { registerBeforeinstallprompt } from '../../utils/sw';

// #region types
type Props = {
  children: any,
};
// #endregion

// #region constants
const flexibilityJsForIE = `
<!--[if !IE]-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/flexibility/2.0.1/flexibility.js"></script>
<!--[endif]-->
`;
const { accent } = theme;
const { og, seo, viewport } = appConfig.metas;
// #endregion

function Layout({ children }: Props) {
  useEffect(() => registerBeforeinstallprompt(), []);

  return (
    <div>
      <Head>
        <title>{seo.title}</title>
        <meta name="viewport" content={viewport} />
        <meta charSet="utf-8" />
        <meta name="application-name" content={seo.name} />
        <meta name="theme-color" content={accent} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content={seo.title} />
        {/* <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" /> */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />

        <meta property="og:url" content={og.url} />
        <meta property="og:title" content={og.title} />
        <meta property="og:type" content={og.type} />
        <meta property="og:site_name" content={og.site_name} />
        <meta property="og:image" content={og.image} />
        <meta property="og:locale" content={og.locale} />
        <meta property="og:description" content={og.description} />

        <link rel="manifest" href="static/manifest.json" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/bootswatch/4.2.1/cosmo/bootstrap.min.css"
        />

        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="static/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="static/favicon-16x16.png"
        />

        <link
          rel="mask-icon"
          href="static/safari-pinned-tab.svg"
          color={accent}
        />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="static/apple-touch-icon.png"
        />
        <link
          rel="apple-touch-startup-image"
          href="static/apple-touch-icon.png"
        />
      </Head>

      <noscript>
        <div className="alert  alert-warning">
          <h4>Warning!</h4>
          <h5>Javascript is disabled for this website.</h5>
          <p>Javascript is required to use this website.</p>
          <p>
            {`You won't be able to navigate in this website until you activate javascript.`}
          </p>
        </div>
      </noscript>
      {children}
      <div dangerouslySetInnerHTML={{ __html: flexibilityJsForIE }} />
    </div>
  );
}

// #region statics
Layout.displayName = 'Layout';
// #endregion

export default Layout;
