/**
 * ESLint rule that identifies and flags untranslated user-facing strings in object properties.
 *
 * This rule helps maintain internationalization consistency by detecting untranslated
 * strings in specific object properties (default: 'label'). It suggests using
 * intl.formatMessage for proper translation.
 *
 * Note: The rule is currently implemented as a local rule, with plans to publish as
 * an npm package to make it available to the broader development community.
 *
 * @example
 * // ❌ Incorrect - Untranslated strings
 * const options = [
 *   { value: "inbox", label: "Inbox" },
 *   { value: "starred", label: "Starred messages" },
 *   { value: "spam", label: "Spam folder" }
 * ];
 *
 * // ✅ Correct - Using intl.formatMessage with descriptions
 * const options = [
 *   {
 *     value: "inbox",
 *     label: intl.formatMessage({
 *       defaultMessage: "Inbox",
 *       description: "Label for main message inbox folder option"
 *     })
 *   },
 *   {
 *     value: "starred",
 *     label: intl.formatMessage({
 *       defaultMessage: "Starred messages",
 *       description: "Label for folder containing messages marked as important"
 *     })
 *   },
 *   {
 *     value: "spam",
 *     label: intl.formatMessage({
 *       defaultMessage: "Spam folder",
 *       description: "Label for folder containing filtered spam messages"
 *     })
 *   }
 * ];
 *
 * @see https://www.canva.dev/docs/apps/localization/
 */
export default {
  rules: {
    "enforce-object-property-translation": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Enforce translation of specific properties using intl.formatMessage",
          category: "Possible Errors",
          recommended: true,
        },
        fixable: "code",
        schema: [
          {
            type: "object",
            properties: {
              properties: {
                type: "array",
                items: { type: "string" },
                default: ["label"],
              },
              intlObjectName: {
                type: "string",
                default: "intl",
              },
            },
            additionalProperties: false,
          },
        ],
        messages: {
          untranslatedProperty: `If "{{ originalMessage }}" is a user-facing string, you should translate it using "intl.formatMessage". See https://www.canva.dev/docs/apps/localization/.`,
        },
      },
      create(context) {
        const config = context.options[0] || {};
        const propertiesToCheck = config.properties || ["label"];
        const intlObjectName = config.intlObjectName || "intl";

        function getTemplateLiteralString(node) {
          const src = context.getSourceCode();
          return src.getText(node);
        }

        // Extract string content from different node types
        function extractStringContent(node) {
          if (!node) return [];

          switch (node.type) {
            // label: "Foo"
            case "Literal":
              return typeof node.value === "string"
                ? [{ node, value: node.value }]
                : [];

            // label: `Foo ${bar}`
            case "TemplateLiteral":
              return [{ node, value: getTemplateLiteralString(node) }];
            // label: foo || "Bar"
            case "LogicalExpression": {
              if (node.operator === "||") {
                return [
                  ...extractStringContent(node.left),
                  ...extractStringContent(node.right),
                ];
              }
              return [];
            }
            // label: "Foo" + "Bar" + "Baz"
            case "BinaryExpression":
              if (node.operator === "+") {
                return [
                  ...extractStringContent(node.left),
                  ...extractStringContent(node.right),
                ];
              }
              return [];
            // label: foo ? "Foo" : "Bar"
            case "ConditionalExpression":
              return [
                ...extractStringContent(node.consequent),
                ...extractStringContent(node.alternate),
              ];

            default:
              return [];
          }
        }

        function isTranslated(node) {
          return (
            node.parent.type === "CallExpression" &&
            node.parent.callee.type === "MemberExpression" &&
            node.parent.callee.object.name === intlObjectName &&
            node.parent.callee.property.name === "formatMessage"
          );
        }

        return {
          Property(node) {
            const keyName = node.key.name || node.key.value;
            if (propertiesToCheck.includes(keyName)) {
              const results = extractStringContent(node.value);
              if (!results) return;
              results.forEach((result) => {
                const { node: stringNode, value: stringValue } = result;

                if (!isTranslated(stringNode)) {
                  context.report({
                    node: stringNode,
                    messageId: "untranslatedProperty",
                    data: {
                      property: keyName,
                      originalMessage:
                        stringValue.length > 40
                          ? stringValue.split(" ").slice(0, 4).join(" ") + "..."
                          : stringValue,
                      intlObjectName,
                    },
                    fix(fixer) {
                      const newText = `${intlObjectName}.formatMessage({
            defaultMessage: ${JSON.stringify(stringValue)},
            // TODO: Provide a meaningful description for translators
            description: ""
          })`;
                      return fixer.replaceText(stringNode, newText);
                    },
                  });
                }
              });
            }
          },
        };
      },
    },
  },
};
