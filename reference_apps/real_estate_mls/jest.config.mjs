import { pathsToModuleNameMapper } from "ts-jest";
import tsconfig from "./tsconfig.json" with { type: "json" };

const { compilerOptions } = tsconfig;

/** @type {import('jest').Config} */

export default {
  testEnvironment: "jsdom",
  testRegex: "\\.(spec|test)\\.[mc]?tsx?$",
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.agents/",
    "/.claude/",
    "/.codex/",
  ],
  modulePathIgnorePatterns: [
    "./internal/",
    "./node_modules/",
    "./.agents/",
    "./.claude/",
    "./.codex/",
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: "<rootDir>/",
  }),
  transform: {
    ".+\\.(css)$": "jest-css-modules-transform",
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
  setupFiles: ["<rootDir>/jest.setup.ts"],
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
};
