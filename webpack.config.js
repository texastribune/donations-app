const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    new: path.join(__dirname, 'source', 'javascripts', 'index.js')
  },

  output: {
    path: path.join(__dirname, '.tmp', 'dist'),
    filename: 'javascripts/bundle.js',
    library: 'bundle',
    libraryTarget: 'var',
    publicPath: './'
  },

  watchOptions: {
    poll: true,
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
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],

  module: {
    rules: [
      {
        test: /\.scss$/,
        include: [
          /source/,
          /node_modules/
        ],
        use: ExtractTextPlugin.extract({
          publicPath: '../bg/',
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader?importLoaders=1'
          }, {
            loader: 'postcss-loader'
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
        include: [
          /source/,
          /node_modules/
        ],
        use: [{
          loader: 'babel-loader'
        }]
      },

      {
        test: /\.(jpg|png|gif|webp)$/,
        include: [
          /source\/scss/,
          /source\/bg/,
          /node_modules/
        ],
        exclude: [
          /source\/img/,
        ],
        use: [{
          loader: 'file-loader?name=[name].[ext]'
        }]
      }
    ]
  }
};
