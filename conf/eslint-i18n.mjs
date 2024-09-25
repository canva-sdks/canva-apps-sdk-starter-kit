import formatjs from "eslint-plugin-formatjs";

export default [
  {
    plugins: {
      formatjs,
    },
    rules: {
      "formatjs/no-invalid-icu": "error",
      "formatjs/no-literal-string-in-jsx": "error",
      "formatjs/enforce-description": "error",
      "formatjs/enforce-default-message": "error",
      "formatjs/enforce-placeholders": "error",
      "formatjs/no-id": "error",
      "formatjs/no-emoji": "error",
      "formatjs/no-useless-message": "error",
      "formatjs/no-multiple-plurals": "error",
      "formatjs/no-offset": "error",
      "formatjs/blocklist-elements": [2, ["selectordinal"]],
      "formatjs/no-complex-selectors": "error",
    }
  }
];
