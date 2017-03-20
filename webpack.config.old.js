const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './raw/js/old.js',

  output: {
    path: path.join(__dirname, 'build', 'javascripts'),
    filename: 'bundle-es3.js',
    publicPath: './'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: [/raw/, /source/, /node_modules/],
        use: [{
          loader: 'babel-loader'
        }]
      }
    ]
  }
};
