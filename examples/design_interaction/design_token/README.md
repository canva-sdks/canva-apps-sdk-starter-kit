# Design token

Demonstrates how to obtain design tokens for accessing design metadata through external APIs. Shows token generation, authentication integration, and design data retrieval patterns.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/design-token/.

Related examples: See fundamentals/fetch for general API communication, or design_interaction/export for design export functionality.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- **In-memory database**: Uses a simple in-memory storage for demonstration. Production apps should use persistent database solutions like PostgreSQL, MongoDB, or similar
- **CORS configuration**: Uses permissive CORS settings. Production apps must restrict CORS to only allow requests from your app's specific origin (https://app-{app-id}.canva-apps.com)
- **Token management**: Token usage patterns are simplified for demonstration purposes. Production apps should implement proper token refresh mechanisms, secure backend communication, and appropriate rate limiting for API calls
- **Error handling**: Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- **Internationalization**: Not implemented in this example. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
