# Design template metadata

Demonstrates how to retrieve template metadata (including keywords and template domain) for templates used in a design.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/design-template-metadata/.

Related examples: See design_interaction/design_metadata for retrieving design information.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Metadata handling is simplified for demonstration purposes only. Production apps should handle metadata gracefully and use metadata for context-aware functionality
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
- The code structure is simplified: Production apps using [intents](/docs/apps/intents/) are recommended to call the prepareDesignEditor function from src/intents/design_editor/index.tsx
