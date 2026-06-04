'use strict';

/**
 * The suite is deliberately transform-free: every module it exercises is plain CommonJS,
 * so there is no Babel step and `yarn test` runs in about a second.
 *
 * What is covered and why is written up in the README under "Testing".
 */

module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  transform: {},
  collectCoverageFrom: [
    'src/lib/**/*.js',
    'src/seed/content.js',
    'config/*.js',
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
  clearMocks: true,
  verbose: false,
};
