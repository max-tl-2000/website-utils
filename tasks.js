/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

/* eslint-disable global-require */
import path from 'path';
import { BROWSER_SYNC_PORT } from './config';
import { getShellExecCommand } from './resources/bnr-helpers';
import { expand } from './resources/expand';

const getDoBuildModule = (pathToConfig = '', { profile, watch } = {}) => {
  const profileStr = profile ? `--profile --json > ${profile}` : '';
  const watchFlag = watch ? '--watch' : '';
  return `babel-node --max-old-space-size=4096 ./node_modules/webpack/bin/webpack ${watchFlag} --display-error-details --bail --config ${pathToConfig} ${profileStr}`;
};

const buildScss = async ({ watch } = {}) => {
  const glob = './src/pages-css/targets/**.scss';
  const files = await expand({ patterns: [glob] });

  console.log('>>> files', files);

  return files.map(f => {
    const name = path.basename(f, '.scss');
    const outputFile = `./predist/pages/${name}.css`;

    const cmd = `node-sass '${f}' '${outputFile}'`;

    if (!watch) {
      return cmd;
    }

    return `watch-spawn -p './src/pages-css/**/*.scss' -i -d 300 ${cmd}`;
  });
};

module.exports = () => ({
  'start:server': {
    cmd: ({ args }) => {
      const command = 'nodemon --exec babel-node ./server/app.js --watch ./config.js --watch ./server/app.js';

      const env = {};

      if (args.legacy) {
        env.REVA_USE_LEGACY = 'true';
      }

      if (args.production) {
        env.NODE_ENV = 'production';
      }

      return {
        env,
        cmd: [command],
      };
    },
  },

  'min-pages': {
    cmd: async () => {
      const files = await expand({ patterns: ['./predist/pages/**/*.css'] });

      const cmd = files.map(f => {
        const name = path.basename(f, '.css');
        const outputFile = `./dist/pages/${name}.min.css`;
        return `csso ${f} -o ${outputFile} --comments exclamation`;
      });

      return {
        cmd: ['mkdir -p ./dist/pages/', ...cmd],
      };
    },
  },

  'build-css:pages': {
    cmd: async ({ args }) => {
      const cssCommands = await buildScss({ watch: args.watch });
      return args.watch ? getShellExecCommand(cssCommands) : cssCommands;
    },
  },

  build: {
    cmd: async ({ args }) => {
      const { production, profile, watch, cssOnly } = args;
      const env = {};
      const buildArgs = {};

      if (production) {
        env.NODE_ENV = 'production';
      }

      if (profile) {
        buildArgs.profile = 'predist/website-utils.stats.json';
      }

      if (watch) {
        buildArgs.watch = true;
      }

      const webpackCommand = getDoBuildModule('webpack.config.js', buildArgs);

      const theCommands = [];

      if (!cssOnly) {
        theCommands.push(webpackCommand);
      }

      theCommands.push(`./bnr build-css:pages${watch ? ' --watch' : ''}`);

      const startCommands = ['mkdir -p ./predist/pages/', 'cp -rv ./thirdparty/maps-deps ./predist/maps-deps'];

      return {
        cmd: watch ? [...startCommands, getShellExecCommand(theCommands)] : [...startCommands, ...theCommands],
        env,
      };
    },
  },
  buildLegacy: {
    cmd: ({ args }) => {
      const { production, profile, watch } = args;
      const env = {};
      const buildArgs = {};

      if (production) {
        env.NODE_ENV = 'production';
      }

      if (profile) {
        buildArgs.profile = 'predist/website-utils.legacy.stats.json';
      }

      if (watch) {
        buildArgs.watch = true;
      }

      return {
        cmd: [getDoBuildModule('webpack-legacy.config.js', buildArgs)],
        env,
      };
    },
  },
  serve: {
    cmd: ({ args }) => {
      const { port = BROWSER_SYNC_PORT } = args;
      const ip = require('ip').address(); // eslint-disable-line global-require

      return {
        cmd: `browser-sync start -s 'test' --files './predist' --files './server/views' --files './server/layouts' --no-notify --host ${ip} --port ${port} --no-open`,
      };
    },
  },
  bump: {
    cmd: ({ args }) => {
      const { type, tag } = args;

      const preId = tag ? `--preid=${tag}` : '';

      return ['npm run check', `npm version ${type} ${preId} -m 'BLD: Release v%s'`];
    },
  },
  pushChangelogAndTags: {
    cmd: ({ args }) => {
      const { remote, branch, tag } = args;
      if (!remote) {
        throw new Error('remote must be specified');
      }

      if (!branch) {
        throw new Error('branch must be specified');
      }

      const changelogFile = `changelog${tag ? `.${tag}` : ''}.md`;

      return {
        cmd: [
          `changelogx -c changelogx.config.js -f markdown -o ./${changelogFile}`,
          `git add ./${changelogFile}`,
          "git commit -m 'DOC: Generate changelog' --no-verify",
          `git push ${remote} ${branch} --no-verify`,
          `git push ${remote} ${branch} --tags --no-verify`,
        ],
        env: {
          TAGS_FILTER: tag,
        },
      };
    },
  },

  genChangelog: {
    cmd: ({ args }) => {
      const { tag } = args;
      const env = {};

      const changelogFile = `changelog${tag ? `.${tag}` : ''}.md`;

      if (tag) {
        env.TAGS_FILTER = tag;
      }

      return {
        cmd: [`changelogx -c changelogx.config.js -f markdown -o ./${changelogFile}`],
        env,
      };
    },
  },

  mergeBranches: {
    task: async ({ args }) => {
      const { mergeBranches } = require('./resources/merge-branches/merge-branches');
      const { branchesToMerge: branches, commitsToVerify, remote, ignoreMergeCheckOnBranches } = require('./resources/merge-branches/merge-branches.config');
      await mergeBranches({ branches, commitsToVerify, remote, ignoreMergeCheckOnBranches, ...args });
    },
  },
});
