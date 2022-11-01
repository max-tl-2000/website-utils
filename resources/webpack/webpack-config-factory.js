/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import webpack from 'webpack';
import strip from 'strip-loader';
import trim from 'jq-trim';
import pkg from '../../package.json';

import { configureCSSSupport } from './configure-css-support';

import { addBabelLoader, getBabelLoaderUseChain } from './get-babel-loader';
import { getDllsReferencePlugins } from './get-dll-reference';

import { addBannerPlugin } from './add-banner-plugin';
import { addManifestPlugin } from './add-manifest-plugin';

const getEnvBool = variable => trim(process.env[variable]) === 'true';

export const makeConfig = ({
  id,
  entry,
  externals = {},
  context,
  babelConfigPath,
  outputPath,
  main,
  pathToVendorsJSON,
  variableDefinitions,
  manifestFileName = 'main-manifest.json',
  browserTargets,
  forceProd,
}) => {
  const MOBX_DEVTOOLS = getEnvBool('MOBX_DEVTOOLS');
  const PROD_MODE = process.env.NODE_ENV === 'production' || forceProd;
  const chromeOnly = process.env.DEV_CHROME_ONLY === 'true';

  const loaders = [];

  let webpackPlugins = getDllsReferencePlugins(context, pathToVendorsJSON);

  if (PROD_MODE) {
    loaders.push({
      test: /\.js$/,
      exclude: /node_modules/,
      loader: strip.loader('debug'),
    });

    const defaultDefinitions = {
      __MOBX_DEVTOOLS__: false,
      __PKG_VERSION__: JSON.stringify(pkg.version),
      'process.env': {
        // replacing all instances of process.env.NODE_ENV with development
        NODE_ENV: '"production"',
        CUCUMBER_CI_JOB: process.env.CUCUMBER_CI_JOB === 'true',
      },
      ...variableDefinitions,
    };

    webpackPlugins = webpackPlugins.concat([new webpack.DefinePlugin(defaultDefinitions)]);
  } else {
    webpackPlugins = webpackPlugins.concat([
      // hot reload
      // disabled as website-utils is not using hot-reload
      // new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        __MOBX_DEVTOOLS__: MOBX_DEVTOOLS,
        __PKG_VERSION__: JSON.stringify(pkg.version),
        'process.env': {
          // replacing all instances of process.env.NODE_ENV with development
          NODE_ENV: '"development"',
          CUCUMBER_CI_JOB: process.env.CUCUMBER_CI_JOB === 'true',
        },
      }),
    ]);
  }

  // if main option is set
  // we ignore the entry option
  if (main) {
    entry = {
      main,
    };
  }

  const config = {
    name: id,
    mode: 'none', // we handle the modes
    // best performance is achieved with `eval`. It takes 1-1.5s per rebuild
    // `source-map` can't be cached. It takes 4-6s per rebuild
    // `eval-source-map` can be cached, but it is still slow 3-4s per rebuild
    devtool: PROD_MODE ? 'source-map' : process.env.WP_DEVTOOL || 'eval-source-map',
    context,
    cache: true,
    externals,
    stats: {
      children: false,
    },
    entry,
    output: {
      path: outputPath,
      filename: '[name].js',
      publicPath: '/dist/',
    },
    optimization: {
      noEmitOnErrors: true,
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.svg$/,
          use: [
            ...getBabelLoaderUseChain({ isProd: PROD_MODE, id, babelConfigPath, hot: false, chromeOnly, browserTargets }),
            {
              loader: '@redisrupt/react-svg-loader',
              options: {
                svgo: {
                  // svgo options
                  plugins: [{ removeTitle: false }, { removeViewBox: false }],
                  floatPrecision: 2,
                },
              },
            },
          ],
        },
        {
          test: /(\.png|\.jpg)$/,
          use: [{ loader: 'url-loader', options: { limit: 100000 } }],
        },
      ],
    },
    resolve: {
      unsafeCache: !PROD_MODE,
      modules: ['node_modules'],
      extensions: ['.json', '.js', '.ts', '.tsx'],
    },
    plugins: webpackPlugins,
    performance: {
      hints: PROD_MODE ? 'warning' : false,
    },
    node: {
      tls: 'empty',
      fs: 'empty',
    },
  };

  configureCSSSupport({ config, extractText: PROD_MODE, addCSSLoader: true });
  addBabelLoader({ config, id, babelConfigPath, isProd: PROD_MODE, hot: false, chromeOnly, browserTargets });
  addBannerPlugin(config);
  addManifestPlugin(config, manifestFileName);

  return config;
};
