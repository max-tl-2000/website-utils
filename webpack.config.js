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
  id: 'website-utils',
  context: resolve('./'),
  babelConfigPath: resolve('./babel.config.js'),
  outputPath: resolve('predist/'),
  entry: {
    // paths are relative to the root of the project
    'website-utils': ['./src/main.js'],
  },
  manifestFileName: 'website-utils.json',
  browserTargets: [
    // The last two versions of each browser, excluding versions
    // that don't support <script type="module">.
    'last 2 Chrome versions',
    'not Chrome < 60',
    'last 2 Safari versions',
    'not Safari < 10.1',
    'last 2 iOS versions',
    'not iOS < 10.3',
    'last 2 Firefox versions',
    'not Firefox < 54',
    'last 2 Edge versions',
    'not Edge < 15',
  ],
});

config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

export default config;
