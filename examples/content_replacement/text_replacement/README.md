# Text replacement

Demonstrates how to replace selected plain text elements in a design with new text content. Shows simple text selection detection and text substitution patterns using the Canva Apps SDK selection API.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/text-replacement/.

Related examples: See content_replacement/richtext_replacement for formatted text replacement, or content_replacement/text_translation for advanced text transformation.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Text content is hardcoded for demonstration purposes only. Production apps should provide user input interfaces or dynamic content loading capabilities
- Text handling is simplified for demonstration. Production apps should handle various text formats, provide validation, and include undo functionality for better user experience
- Error handling is minimal for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes for network issues and API errors
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
- The app uses simplified selection logic. Production apps should handle edge cases like mixed content selection and provide clear feedback when no valid text is selected
