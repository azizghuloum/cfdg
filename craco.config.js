const path = require('path');

module.exports = {
  webpack: {
    configure: (config) => {
      // config.module.rules.push({
      //   test: /\.worker\.ts$/,
      //   use: { loader: 'worker-loader' },
      // });
      return config;
    },
  }
};
