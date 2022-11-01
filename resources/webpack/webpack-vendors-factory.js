/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import webpack from 'webpack';
import { join } from 'path';
import { configureCSSSupport } from './configure-css-support';
import { getBabelLoader } from './get-babel-loader';
import { getDllsReferencePlugins } from './get-dll-reference';
import { addManifestPlugin } from './add-manifest-plugin';

import { addBannerPlugin } from './add-banner-plugin';
export const makeVendorsConfig = ({
  babelConfigPath,
  context,
  outputPath,
  entry,
  manifestFileName = 'vendors-manifest.json',
  pathToVendorsJSON,
  externals,
}) => {
  const PROD_MODE = process.env.NODE_ENV === 'production';

  const babelLoader = getBabelLoader({ babelConfigPath, isProd: PROD_MODE, hot: false, chromeOnly: process.env.DEV_CHROME_ONLY === 'true' });

  const config = {
    mode: 'none',
    devtool: PROD_MODE ? 'source-map' : process.env.WP_DEVTOOL || 'eval-source-map',
    context,
    cache: true,
    externals,
    entry,
    output: {
      filename: PROD_MODE ? '[name].js' : '[name]-[contenthash].js', // in prod the hash is created at minification phase
      path: outputPath,
      library: '[name]',
      pathinfo: false,
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /(\.png|\.jpg)$/,
          use: [{ loader: 'url-loader', options: { limit: 100000 } }],
        },
        babelLoader,
      ],
    },
    stats: {
      children: false,
    },
    plugins: [
      new webpack.DefinePlugin({
        __DEVTOOLS__: '__REDUX_DEV_TOOLS__',
        'process.env.NODE_ENV': PROD_MODE ? '__RED_PROD_MODE__' : '"development"',
        'process.env.CUCUMBER_CI_JOB': process.env.CUCUMBER_CI_JOB === 'true',
      }),
    ],

    resolve: {
      modules: ['client', 'node_modules', 'common'],
      extensions: ['.json', '.js'],
    },
    performance: {
      hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
    },
    node: {
      tls: 'empty',
      fs: 'empty',
    },
  };

  configureCSSSupport({ config, extractText: PROD_MODE });
  addBannerPlugin(config);
  addManifestPlugin(config, manifestFileName);

  config.plugins.push(
    new webpack.DllPlugin({
      name: '[name]',
      path: join(outputPath, '[name].json'),
    }),
  );

  if (pathToVendorsJSON) {
    config.plugins = getDllsReferencePlugins(context, pathToVendorsJSON).concat(config.plugins);
  }

  return config;
};
