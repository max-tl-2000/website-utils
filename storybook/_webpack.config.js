/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import webpack from 'webpack';
import { resolve } from 'path';

import { configureCSSSupport } from '../resources/webpack/configure-css-support';
import { addBabelLoader } from '../resources/webpack/get-babel-loader';

module.exports = ({ config }) => {
  // the fileloader includes the svg which breaks our react-svg-loader
  // so by removing it from the test regexp we can make that loader to ignore the svg files
  config.module.rules[3].test = /\\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\\?.*)?$/;

  // add support for scss files
  configureCSSSupport({ config, extractText: false });

  addBabelLoader({ test: /\.ts$/, config, isProd: false, babelConfigPath: resolve(__dirname, '../babel.config.js') });

  // add react-svg-loader
  config.module.rules.push({
    test: /\.svg$/,
    use: [
      'babel-loader',
      {
        loader: '@redisrupt/react-svg-loader',
        options: {
          svgo: {
            // true outputs JSX tags
            // svgo options
            plugins: [{ removeTitle: false }, { removeViewBox: false }],
            floatPrecision: 2,
          },
        },
      },
    ],
  });

  config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

  config.resolve.extensions.push('.ts');

  return config;
};
