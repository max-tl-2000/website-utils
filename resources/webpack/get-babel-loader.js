/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

// import { getCacheInterface } from './cache-interface';

export const getBabelLoaderUseChain = ({ id, isProd, babelConfigPath, hot, chromeOnly, browserTargets }) => {
  // const cacheInterface = getCacheInterface('babel');
  const babelrc = require(babelConfigPath); // eslint-disable-line global-require

  // override the babel config to target browsers instead of node
  const envPreset = babelrc.presets[0];
  const presetConfig = envPreset[1];
  presetConfig.modules = false;
  presetConfig.useBuiltIns = 'entry';
  presetConfig.corejs = 3;

  presetConfig.targets = { browsers: isProd ? ['last 2 versions'] : [`last 2 ${chromeOnly ? 'Chrome ' : ''}versions`] };

  if (browserTargets) {
    presetConfig.targets.browsers = browserTargets;
  }

  const babelLoaderOptions = {
    babelrc: false, // this is important to prevent babel from trying to use the babelrc
    presets: babelrc.presets,
    cacheDirectory: !id ? true : `node_modules/.cache/babel-loader-${id}`,
    plugins: babelrc.plugins,
  };

  console.log('babelLoaderOptions', babelLoaderOptions.cacheDirectory);

  if (!isProd && hot) {
    babelLoaderOptions.plugins = babelLoaderOptions.plugins.concat(['react-hot-loader/babel']);
  }

  const baseCachePath = 'node_modules/.cache/cache-loader';

  return [
    !isProd ? { loader: 'cache-loader', options: { cacheDirectory: id ? `${baseCachePath}-${id}` : `${baseCachePath}` } } : null,
    {
      loader: 'babel-loader',
      options: babelLoaderOptions,
    },
  ].filter(desc => !!desc);
};

export const getBabelLoader = ({ id, test, isProd, babelConfigPath, hot, chromeOnly, browserTargets }) => {
  const babelLoader = {
    test: test || /\.ts$|\.js$/,
    exclude: file => file.match(/\/node_modules\//),
    use: getBabelLoaderUseChain({ id, isProd, babelConfigPath, hot, chromeOnly, browserTargets }),
  };

  return babelLoader;
};

export const addBabelLoader = ({ config, ...rest }) => {
  const babelLoader = getBabelLoader(rest);
  config.module.rules.unshift(babelLoader);
};
