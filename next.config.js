// #region imports
const withOffline = require('next-offline');
// #endregion

// next.config.js
const nextConfig = {
  // next-offline options:
  dontAutoRegisterSw: true, // since we want runtime registration

  /* static page export options: */
  exportPathMap: function() {
    return {
      '/': { page: '/' },
    };
  },
};

module.exports = withOffline(nextConfig);
