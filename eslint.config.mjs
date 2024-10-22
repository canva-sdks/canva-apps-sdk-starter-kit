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
    "plugin:jest/recommended",
  ),
  ...general,
  ...i18n.map((config) => ({
    ...config,
    files: [
      "src/**/*",
      // Currently only the 'i18n' example is localized and following the
      // formatjs guidelines. If more examples are localized, this list
      // should be updated:
      "examples/i18n/**/*",
    ],
  })),
];
