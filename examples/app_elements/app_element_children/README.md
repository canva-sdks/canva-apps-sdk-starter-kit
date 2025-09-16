# App element children

Demonstrates how app elements can contain multiple child elements positioned relative to each other. Creates a customizable grid of square shapes where users can control rows, columns, spacing, and individual element properties. This example showcases the core app element renderer API and how to create complex multi-element designs programmatically.

For API reference docs and instructions on running this example, see: <https://www.canva.dev/docs/apps/examples/app-element-children/>.

Related example: See app_image_elements for working with single elements within app elements.

NOTE: This example differs from what's expected for public apps to pass a Canva review:

- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Accessibility features aren't fully implemented. Production apps must meet WCAG 2.0 AA standards with proper keyboard navigation and ARIA labels
- Input validation is minimal for demonstration. Production apps must validate all user inputs and provide clear error messaging
- Internationalization isn't implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
