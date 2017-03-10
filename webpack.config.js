const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './raw/js/index.js',

  output: {
    path: path.join(__dirname, 'source'),
    filename: 'javascripts/bundle.js',
    publicPath: './'
  },

  resolve: {
    modules: [
      'node_modules',
      path.join(__dirname, 'source')
    ],

    extensions: ['.js']
  },

  plugins: [
    new ExtractTextPlugin({
      filename: 'css/styles.css'
    })
  ],

  module: {
    rules: [
      {
        test: /\.scss$/,
        include: [/raw/, /source/, /node_modules/],
        use: ExtractTextPlugin.extract({
          publicPath: '../bg/',
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
        include: [/raw/, /source/, /node_modules/],
        use: [{
          loader: 'babel-loader'
        }]
      },

      {
        test: /\.(jpg|png|gif|webp)$/,
        include: [
          /raw/,
          /source\/scss/,
          /source\/bg/,
          /node_modules/
        ],
        exclude: [
          /source\/img/,
        ],
        use: [{
          loader: 'file-loader?name=[name].[ext]&outputPath=bg/'
        }]
      }
    ]
  }
};
