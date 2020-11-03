process.traceDeprecation = true;

// Require
const { resolve } = require('path');

// JavaScript Entries.
const entries = ['index', 'about'];

// Paths + Entry Map.
const buildPath = resolve(__dirname, 'build');
const entryPaths = entries
  .map((entry) => [entry, resolve(__dirname, 'src/js', `${entry}.js`)])
  .reduce((obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }), {});

// Webpack Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { WebpackPluginServe } = require('webpack-plugin-serve');

const config = {
  mode: 'development',
  entry: {
    ...entryPaths,
    server: 'webpack-plugin-serve/client',
  },
  devtool: 'inline-source-map',
  output: {
    path: buildPath,
    filename: 'js/[name].js',
    chunkFilename: 'js/vendor.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true,
            },
          },
          'postcss-loader?sourceMap',
        ],
      },
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              sourceMap: true,
            },
          },
          'postcss-loader?sourceMap',
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
      },
      {
        exclude: [/\.html$/, /\.(js|jsx)$/, /\.css$/, /\.json$/],
        type: 'asset/inline',
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      name: 'vendor',
    },
  },
  plugins: [
    new WebpackPluginServe({
      port: 3000,
      static: buildPath,
    }),
    new ESLintPlugin({
      cache: true,
      files: './src',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/',
          to: '[path][name].[ext]',
        },
      ],
    }),
    ...entries.map(
      (entry) =>
        new HtmlWebpackPlugin({
          inject: true,
          template: `./src/${entry}.html`,
          filename: `${entry}.html`,
          chunks: [`${entry}`, 'vendor'],
        }),
    ),
  ],
  watch: true,
};

module.exports = config;
