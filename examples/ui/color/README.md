# Color selection

Demonstrates how to implement color selection using the color selector interface. Shows color picker integration, brand color access, and color swatch functionality for design consistency.

For API reference docs and instructions on running this example, see: <https://www.canva.dev/docs/apps/examples/color/>.

Related examples: See design_elements/text_elements for applying selected colors to elements, or other UI examples for design system integration.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Color accessibility validation is not implemented. Production apps must ensure color combinations meet WCAG 2.0 AA contrast standards
- Brand guideline integration is not demonstrated. Production apps should respect brand colors when available
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
