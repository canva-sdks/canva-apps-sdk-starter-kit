const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig.json')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testRegex: '(/tests/.*|(\\.|/)(tests))\\.tsx?$',
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  transform: {
    ".+\\.(css)$": "<rootDir>/node_modules/jest-css-modules-transform",
  },
  transformIgnorePatterns: ['node_modules'],
  testPathIgnorePatterns: [ '/node_modules/', '/dist/'],
};
