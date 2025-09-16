# Fonts

Demonstrates how to find, select, and apply fonts to text elements. Shows font discovery, weight and style selection, and font picker integration for creating styled text with custom typography.

For API reference docs and instructions on running this example, see: <https://www.canva.dev/docs/apps/examples/fonts/>.

Related examples: See design_elements/text_elements for basic text insertion, or app_text_elements for text within app elements.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Error handling for font loading and unavailable fonts is simplified for demonstration. Production apps must implement comprehensive error handling with retry logic and user feedback for API failures
- Font fallback handling is not implemented. Production apps should provide fallback fonts and handle font loading failures gracefully
- Text content is hardcoded for demonstration purposes only. Production apps should provide user input interfaces or dynamic content loading
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
