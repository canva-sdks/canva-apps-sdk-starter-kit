# Text translation

Demonstrates advanced text transformation patterns including translation with and without formatting preservation. Shows bulk text editing, content session management, and complex text replacement workflows.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/text-translation/.

Related examples: See content_replacement/text_replacement for basic text substitution, or content_replacement/richtext_replacement for rich text modifications.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Mock translation data is used for demonstration purposes only. Production apps should integrate with real translation services and provide user input interfaces or dynamic content loading
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Text format handling is simplified for demonstration. Production apps should handle various text formats and respect formatting preferences
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
