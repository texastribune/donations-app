var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

module.exports = {
  entry: './source/javascripts/index.js',

  output: {
    path: __dirname + '/.tmp/dist',
    filename: 'javascripts/bundle.js',
    publicPath: '/'
  },

  resolve: {
    modules: [
      'node_modules',
      path.join(__dirname, 'source')
    ],

    extensions: ['.js', '.css', '.scss']
  },

  plugins: [
    new ExtractTextPlugin('styles.css')
  ],

  module: {
    rules: [
      {
        test: /\.scss$/,
        include: [/source/, /node_modules/],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader'
          }, {
            loader: 'sass-loader',
            options: {
              includePaths: [
                require('node-bourbon').includePaths,
                require('node-neat').includePaths
              ]
            }
          }]
        })
      },

      {
        test: /\.js$/,
        include: [/source/, /node_modules/],
        use: [{
          loader: 'babel-loader',
          options: { presets: ['es2015'] }
        }],
      }
    ]
  }
};
