/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '(/tests/.*|(\\.|/)(tests))\\.ts?$',
  modulePathIgnorePatterns: ['./internal/', './node_modules/'],
};
