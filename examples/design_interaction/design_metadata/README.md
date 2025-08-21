# Design metadata

Demonstrates how to retrieve design information including title, dimensions, and other metadata properties. Shows design introspection and metadata access patterns.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/design-metadata/.

Related examples: See design_interaction/design_token for accessing designs via external APIs, or design_interaction/export for design export functionality.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Metadata handling is simplified for demonstration purposes only. Production apps should handle metadata gracefully and use metadata for context-aware functionality
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
