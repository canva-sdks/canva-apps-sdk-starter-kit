# Authentication

Demonstrates how to implement OAuth authentication flow for accessing external services on behalf of users. Shows token management, user authorization, and authenticated API requests.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/authentication/.

Related examples: See fundamentals/fetch for general API communication, or design_interaction/design_token for design-specific authentication patterns.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Token storage and security is simplified for demonstration. Production apps must implement secure token storage and follow OAuth security best practices
- Error handling for authentication failures is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Token refresh mechanisms are not implemented. Production apps should implement proper token lifecycle management
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
