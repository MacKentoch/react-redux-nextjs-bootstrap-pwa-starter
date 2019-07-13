const withOffline = require('next-offline');

const nextConfig = {
  // next-offline options:
  dontAutoRegisterSw: true, // since we want runtime registration
};

module.exports = withOffline(nextConfig);
