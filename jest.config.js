const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jsdom",
  testRegex: "\\.(spec|test)\\.[mc]?tsx?$",
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  modulePathIgnorePatterns: [
    "./node_modules/",
    "./.agents/",
    "./.claude/",
    "./.codex/",
  ],
  transform: {
    ".+\\.(css)$": "<rootDir>/node_modules/jest-css-modules-transform",
    "^.+\\.tsx?$": [
      "@swc/jest",
      {
        jsc: {
          transform: { react: { runtime: "automatic" } },
          experimental: {
            plugins: [
              [
                "@swc/plugin-formatjs",
                {
                  idInterpolationPattern: "[sha512:contenthash:base64:6]",
                  ast: true,
                },
              ],
            ],
          },
        },
      },
    ],
  },
  transformIgnorePatterns: ["node_modules"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/templates/",
    "/reference_apps/",
    "/.agents/",
    "/.claude/",
    "/.codex/",
  ],
  setupFiles: ["<rootDir>/jest.setup.ts"],
};
