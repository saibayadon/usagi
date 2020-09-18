// Require
const path = require('path');

// JavaScript Entries.
const entries = ['index', 'about'];

// Paths + Entry Map.
const buildPath = path.resolve(__dirname, 'build');
const entryPaths = entries
  .map((entry) => [entry, path.resolve(__dirname, 'src/js', `${entry}.js`)])
  .reduce((obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }), {});

// Webpack Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const config = {
  entry: entryPaths,
  output: {
    path: buildPath,
    publicPath: '/',
    filename: 'js/[name].js',
    chunkFilename: 'js/vendor.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          { loader: 'postcss-loader' },
        ],
      },
      {
        test: /\.module\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
            },
          },
          { loader: 'postcss-loader' },
        ],
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
          limit: 2000,
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
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/',
          to: '[path][name].[ext]',
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
    }),
    ...entries.map(
      (entry) =>
        new HtmlWebpackPlugin({
          inject: true,
          template: `./src/${entry}.html`,
          filename: `${entry}.html`,
          chunks: [`${entry}`, 'vendor'],
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          },
        }),
    ),
    new BundleAnalyzerPlugin(),
  ],
};

module.exports = config;
