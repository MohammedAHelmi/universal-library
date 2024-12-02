const { resolve, join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

require('dotenv').config();

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  entry:  resolve(__dirname, '../', 'src', 'index.js'),
  
  devtool: isDev? 'eval-source-map': 'eval',

  output: {
    path: join(__dirname, '../', 'public'),
    filename: 'bundle.js',

    publicPath: "/"
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            "presets": [
              ["@babel/preset-env"],
              ["@babel/preset-react", {runtime: 'automatic'}]
            ]
          }
        },
      },
    ],
  },

  optimization: {
    usedExports: true, // Enables tree shaking
  },
  
  plugins: [
    new Dotenv({ path: join(__dirname, '.env.frontend') }),
    ...(!isDev? []: [
      new HtmlWebpackPlugin({
        template: resolve(__dirname, '../', 'public/index.html'),
      }),
    ])
  ],

  devServer: {
    static: {
      directory: join(__dirname, '../', 'public'),
    },
    compress: true,
    port: process.env.FRONTEND_PORT || 7001,
    historyApiFallback: true // allows the app handle the routes server doesn't find
  }
};