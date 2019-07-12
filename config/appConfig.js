// @flow

export const appConfig = Object.freeze({
  // #region flag: set fetch mock or real fetch
  DEV_MODE: true,
  // #endregion

  // #region API
  api: {
    fakeEndPoint: 'api/somewhere',
  },
  // #endregion

  // #region Meta / SEO
  metas: {
    viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
    seo: {
      title: 'react-nextjs-pwa-starter',
      name: 'react-nextjs-pwa-starter',
      description: 'ReactJS + Redux NextJS Progressive webapp starter',
    },
    og: {
      title: 'react-nextjs-pwa-starter',
      url: './',
      type: 'website',
      description: 'ReactJS + Redux NextJS Progressive webapp starter',
      image: 'static/android-chrome-192x192.png',
      site_name: 'react-nextjs-pwa-starter',
      locale: 'en_US',
    },
  },
  // #endregion
});

export default appConfig;
