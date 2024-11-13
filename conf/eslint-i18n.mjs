import formatjs from "eslint-plugin-formatjs";

export default [
  {
    plugins: {
      formatjs,
    },
    rules: {
      "formatjs/no-invalid-icu": "error",
      "formatjs/no-literal-string-in-jsx": [
        2,
        {
          props: {
            // These rules are for @canva/app-ui-kit components.
            // For your own components, suppress any false positives using eslint ignore comments.
            include: [
              ["*", "(*Label|label|alt)"],
              ["*", "(title|description|name|text)"],
              ["*", "(placeholder|additionalPlaceholder|defaultValue)"],
              ["FormField", "error"],
            ],
            exclude: [["FormattedMessage", "description"]],
          },
        },
      ],
      "formatjs/enforce-description": ["error", "literal"],
      "formatjs/enforce-default-message": ["error", "literal"],
      "formatjs/enforce-placeholders": "error",
      "formatjs/no-id": "error",
      "formatjs/no-emoji": "error",
      "formatjs/no-useless-message": "error",
      "formatjs/no-multiple-plurals": "error",
      "formatjs/no-offset": "error",
      "formatjs/blocklist-elements": [2, ["selectordinal"]],
      "formatjs/no-complex-selectors": "error",
    },
  },
];
