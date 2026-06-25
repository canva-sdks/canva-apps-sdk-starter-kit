import { pathsToModuleNameMapper } from "ts-jest";
import tsconfig from "./tsconfig.json" with { type: "json" };

const { compilerOptions } = tsconfig;

/** @type {import('ts-jest').JestConfigWithTsJest} */

export default {
  preset: "ts-jest",
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
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}),
  transform: {
    ".+\\.(css)$": "jest-css-modules-transform",
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        astTransformers: {
          before: [
            {
              path: "@formatjs/ts-transformer/ts-jest-integration",
              options: {
                overrideIdFn: "[sha512:contenthash:base64:6]",
                ast: true,
              },
            },
          ],
        },
      },
    ],
  },
  setupFiles: ["<rootDir>/jest.setup.ts"],
};
