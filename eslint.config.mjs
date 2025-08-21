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
      // Currently only the localization examples are localized and following the
      // formatjs guidelines. If more examples are localized, this list should be
      // updated:
      "examples/localization/**/*",
    ],
    ...canvaPlugin.configs.apps_i18n,
  },
];
