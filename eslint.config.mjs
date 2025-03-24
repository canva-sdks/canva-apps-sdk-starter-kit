import canvaPlugin from "@canva/app-eslint-plugin";

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
  ...canvaPlugin.configs.apps_no_i18n,
  {
    files: [
      "src/**/*",
      // Currently only the 'i18n' example is localized and following the
      // formatjs guidelines. If more examples are localized, this list
      // should be updated:
      "examples/i18n/**/*",
    ],
    ...canvaPlugin.configs.i18n,
  },
];
