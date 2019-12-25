module.exports = api => {
  api.cache(false);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        'babel-plugin-root-import',
        {
          rootPathSuffix: 'src/',
          rootPathPrefix: '@/',
        },
      ],
      ['@babel/plugin-proposal-decorators', { legacy: true }],
    ],
  };
};
