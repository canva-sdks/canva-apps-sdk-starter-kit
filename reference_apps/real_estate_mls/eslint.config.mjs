import canvaPlugin from "@canva/app-eslint-plugin";

export default [
  {
    ignores: [
      "**/node_modules/",
      "**/dist",
      "**/*.d.ts",
      "**/*.d.tsx",
      ".agents/**",
      ".claude/**",
      ".codex/**",
    ],
  },
  ...canvaPlugin.configs.apps,
];
