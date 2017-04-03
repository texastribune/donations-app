const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './raw/js/index-old.js',

  output: {
    path: path.join(__dirname, 'source', 'javascripts'),
    filename: 'bundle-es3.js',
    publicPath: './'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          /raw/,
          /source/,
          /node_modules/
        ],
        use: [{
          loader: 'babel-loader'
        }]
      }
    ]
  }
};
