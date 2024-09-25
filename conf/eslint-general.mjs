import typescriptEslint from "@typescript-eslint/eslint-plugin";
import jest from "eslint-plugin-jest";
import react from "eslint-plugin-react";
import globals from "globals";

export default [
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
      jest,
      react,
    },
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-interface": "warn",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          accessibility: "no-public",
          overrides: {
            parameterProperties: "off",
          },
        },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "typeLike",
          format: ["PascalCase"],
          leadingUnderscore: "allow",
        },
      ],
      "no-invalid-this": "off",
      "@typescript-eslint/no-invalid-this": "error",
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "none",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-require-imports": "error",
      "jest/no-restricted-matchers": [
        "error",
        {
          toContainElement:
            "toContainElement is not recommended as it encourages testing the internals of the components",
          toContainHTML:
            "toContainHTML is not recommended as it encourages testing the internals of the components",
          toHaveAttribute:
            "toHaveAttribute is not recommended as it encourages testing the internals of the components",
          toHaveClass:
            "toHaveClass is not recommended as it encourages testing the internals of the components",
          toHaveStyle:
            "toHaveStyle is not recommended as it encourages testing the internals of the components",
        },
      ],
      "react/jsx-curly-brace-presence": [
        "error",
        {
          props: "never",
          children: "never",
        },
      ],
      "react/jsx-tag-spacing": [
        "error",
        {
          closingSlash: "never",
          beforeSelfClosing: "allow",
          afterOpening: "never",
          beforeClosing: "allow",
        },
      ],
      "react/self-closing-comp": "error",
      "react/no-unescaped-entities": "off",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "default-case": "error",
      eqeqeq: [
        "error",
        "always",
        {
          null: "never",
        },
      ],
      "no-caller": "error",
      "no-console": "error",
      "no-eval": "error",
      "no-inner-declarations": "error",
      "no-new-wrappers": "error",
      "no-restricted-globals": [
        "error",
        {
          name: "fit",
          message: "Don't focus tests",
        },
        {
          name: "fdescribe",
          message: "Don't focus tests",
        },
        {
          name: "length",
          message:
            "Undefined length - Did you mean to use window.length instead?",
        },
        {
          name: "name",
          message: "Undefined name - Did you mean to use window.name instead?",
        },
        {
          name: "status",
          message:
            "Undefined status - Did you mean to use window.status instead?",
        },
        {
          name: "spyOn",
          message: "Don't use spyOn directly, use jest.spyOn",
        },
      ],
      "no-restricted-properties": [
        "error",
        {
          property: "bind",
          message: "Don't o.f.bind(o, ...), use () => o.f(...)",
        },
        {
          object: "ReactDOM",
          property: "findDOMNode",
          message: "Don't use ReactDOM.findDOMNode() as it is deprecated",
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "AccessorProperty, TSAbstractAccessorProperty",
          message:
            "Accessor property syntax is not allowed, use getter and setters.",
        },
        {
          selector: "PrivateIdentifier",
          message:
            "Private identifiers are not allowed, use TypeScript private fields.",
        },
        {
          selector:
            "JSXOpeningElement[name.name = /^[A-Z]/] > JSXAttribute[name.name = /-/]",
          message:
            "Passing hyphenated props to custom components is not type-safe. Prefer a camelCased equivalent if available. (See https://github.com/microsoft/TypeScript/issues/55182)",
        },
        {
          selector:
            "CallExpression[callee.object.name='window'][callee.property.name='open']",
          message:
            "Apps are currently not allowed to open popups, or new tabs via browser APIs. Please use `requestOpenExternalUrl` from `@canva/platform` to link to external URLs. To learn more, see https://www.canva.dev/docs/apps/api/platform-request-open-external-url/",
        },
      ],
      "no-return-await": "error",
      "no-throw-literal": "error",
      "no-undef-init": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "prefer-const": [
        "error",
        {
          destructuring: "all",
        },
      ],
      "prefer-object-spread": "error",
      "prefer-rest-params": "error",
      "prefer-spread": "error",
      radix: "error",
    },
  },
  {
    files: ["**/*.tsx"],
    rules: {
      "react/no-deprecated": "error",
      "react/forbid-elements": [
        "error",
        {
          forbid: [
            {
              element: "video",
              message:
                "Don't use HTML video directly. Instead, use the App UI Kit <VideoCard /> as this respects users' auto-playing preferences",
            },
            {
              element: "em",
              message:
                "Don't use <em> to italicize text. Canva's UI fonts don't support italic font style.",
            },
            {
              element: "i",
              message:
                "Don't use <i> to italicize text. Canva's UI fonts don't support italic font style.",
            },
            {
              element: "iframe",
              message:
                "Canva Apps aren't allowed to contain iframes. You should either recreate the UI you want to show in the iframe in the app directly, or link to your page via a `<Link>` tag.  For more info see https://www.canva.dev/docs/apps/content-security-policy/#what-is-and-isnt-allowed",
            },
            {
              element: "script",
              message:
                "Script tags are not allowed in Canva SDK Apps. You should import JavaScript modules instead. For more info see https://www.canva.dev/docs/apps/content-security-policy/#what-is-and-isnt-allowed",
            },
            {
              element: "a",
              message:
                "Don't use <a> tags. Instead, use the <Link> component from the App UI Kit, and remember to open the url via the requestOpenExternalUrl method from @canva/platform.",
            },
            {
              element: "img",
              message:
                "Have you considered using <ImageCard /> from the App UI Kit instead?",
            },
            {
              element: "embed",
              message:
                "Have you considered using <EmbedCard /> from the App UI Kit instead?",
            },
            {
              element: "audio",
              message:
                "Have you considered using <AudioCard /> from the App UI Kit instead?",
            },
            {
              element: "button",
              message:
                "Rather than using the native HTML <button> element, use the <Button> component from the App UI Kit for consistency and accessibility.",
            },
            {
              element: "input",
              message:
                "Wherever possible, prefer using the form inputs from the App UI Kit for consistency and accessibility (TextInput, Checkbox, FileInput, etc).",
            },
            {
              element: "base",
              message:
                "The <base> tag is not supported in Canva Apps. We recommend using hash-based routing. For more on what is and isn't allowed in Canva Apps see https://www.canva.dev/docs/apps/content-security-policy/#what-is-and-isnt-allowed",
            },
            {
              element: "link",
              message:
                "If you're trying to include a css stylesheet, we recommend importing css using React, or using embedded stylesheets. For more on what is and isn't allowed in Canva Apps see https://www.canva.dev/docs/apps/content-security-policy/#what-is-and-isnt-allowed",
            },
          ],
        },
      ],
    },
  },
];
