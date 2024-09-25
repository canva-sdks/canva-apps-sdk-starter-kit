import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import general from "./conf/eslint-general.mjs";
import i18n from "./conf/eslint-i18n.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      "**/node_modules/",
      "**/dist",
      "**/*.d.ts",
      "**/*.d.tsx",
      "**/sdk",
      "**/internal",
      "**/*.config.*",
    ],
  },
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/strict",
    "plugin:@typescript-eslint/stylistic",
    "plugin:react/recommended",
    "plugin:jest/recommended"
  ),
  ...general,
  ...i18n.map(config => ({
    ...config,
    files: ["src/**/*", "examples/i18n/**/*", "cli/common/templates/gen_ai/**/*", "cli/common/templates/hello_world/**/*"],
  })),

];
