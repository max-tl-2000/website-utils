/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import webpack from 'webpack';
import { resolve } from 'path';
import { makeConfig } from './resources/webpack/webpack-config-factory';

const config = makeConfig({
  id: 'website-utils-legacy',
  context: resolve('./'),
  babelConfigPath: resolve('./babel.config.js'),
  outputPath: resolve('predist/'),
  entry: {
    // paths are relative to the root of the project
    'website-utils-legacy': ['./src/main.js'],
  },
  manifestFileName: 'website-utils-legacy.json',
  browserTargets: [
    // The last two versions of each browser
    'last 2 versions',
    'ie 11',
  ],
});

config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

config.externals = {
  ...config.externals,
  mobx: 'window.mobx',
};

config.resolve = {
  ...config.resolve,
  alias: {
    'mobx-form': 'mobx-form/dist/mobx-form.legacy.js',
  },
};

export default config;
