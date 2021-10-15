module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: [
            '>2%, Firefox ESR, not dead',
          ],
        },
        useBuiltIns: 'usage',
        corejs: '^3.0.0',
      },
    ],
  ],
  plugins: [
    'dynamic-import-webpack',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
  ],
};
