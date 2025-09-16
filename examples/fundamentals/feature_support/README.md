# Feature support

Demonstrates how to detect and handle feature availability across different design types and contexts. Shows dynamic feature detection, graceful degradation, and context-aware UI rendering using the Canva Apps SDK's feature support system.

For API reference docs and instructions on running this example, see: <https://www.canva.dev/docs/apps/examples/feature-support/>.

Related examples: This pattern should be used across all apps to ensure proper functionality across different design contexts.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Feature detection patterns are simplified for demonstration purposes only. Production apps must implement feature detection for all functionality that depends on design context or user permissions
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
