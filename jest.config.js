/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

module.exports = {
  // bail: true,
  verbose: true,
  // collectCoverage: true,
  // collectCoverageFrom: ['src/**/*.{js,jsx}', '!**/node_modules/**', '!**/vendor/**'],
  bail: true,
  setupFiles: ['<rootDir>/resources/jest/setup.js'],
  setupFilesAfterEnv: ['<rootDir>/resources/jest/setup.env.js'],
  moduleFileExtensions: ['js', 'json', 'node', 'ts'],
  moduleNameMapper: {
    '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/resources/jest/FileStub.js',
    '^.+\\.(css|scss)$': 'identity-obj-proxy',
  },
  roots: ['<rootDir>/src/'],
  testPathIgnorePatterns: ['/fixtures/'],
  testRegex: '/__(tests|specs)__/.*.([\\.test\\.spec])\\.(j|t)s$',
  collectCoverage: true,
  coverageReporters: ['lcov', 'json-summary'],
  // transform: {
  //   '^.+\\.(j|t)sx?$': 'babel-jest',
  // },
};
