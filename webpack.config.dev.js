// Require
const { resolve } = require('path');

// JavaScript Entries.
const entries = ['index', 'about'];

// Paths + Entry Map.
const buildPath = resolve(__dirname, 'build');
const entryPaths = entries
  .map(entry => [entry, resolve(__dirname, 'src/js', `${entry}.js`)])
  .reduce((obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }), {});

// Webpack Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
  entry: entryPaths,
  devtool: 'inline-source-map',
  devServer: {
    contentBase: resolve(__dirname, 'build'),
    inline: true,
    publicPath: '/',
    port: 8080,
  },
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
        enforce: 'pre',
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
      },
      {
        exclude: [/\.html$/, /\.(js|jsx)$/, /\.css$/, /\.json$/],
        loader: 'url-loader',
        options: {
          name: 'assets/[hash:8].[ext]',
        },
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
    new CopyWebpackPlugin([
      {
        from: 'public/',
        to: '[name].[ext]',
      },
    ]),
    ...entries.map(
      entry =>
        new HtmlWebpackPlugin({
          inject: true,
          template: `./src/${entry}.html`,
          filename: `${entry}.html`,
          chunks: [`${entry}`, 'vendor'],
        }),
    ),
  ],
};

module.exports = config;
