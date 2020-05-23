const webpack = require('webpack');

module.exports = {
  // baseUrl: '/',
  runtimeCompiler: true,
  devServer: {
    host: 'localhost',
    port: 3000,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    watchOptions: {
      poll: true,
    },
  },
  configureWebpack: {
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
  },
};
