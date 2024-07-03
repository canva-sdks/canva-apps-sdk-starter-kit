/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '(/tests/.*|(\\.|/)(tests))\\.tsx?$',
  modulePathIgnorePatterns: ['./internal/'],
  testPathIgnorePatterns: [ '/node_modules/', '/dist/']
};
