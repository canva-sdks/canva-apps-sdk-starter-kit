# Multi-provider authentication

Demonstrates how to implement OAuth authentication with multiple providers (Meta and Google) in a single app, allowing users to connect to different platforms simultaneously. Shows provider-specific token management, independent authorization flows, and authenticated API requests using tokens from different providers.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/multi-provider-authentication/.

Related examples: See fundamentals/authentication for single-provider OAuth authentication, fundamentals/multi_account_authentication for multiple accounts from a single provider, or design_interaction/design_token for design-specific authentication patterns.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Token storage and security is simplified for demonstration. Production apps must implement secure token storage and follow OAuth security best practices
- Error handling for authentication failures is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Token refresh mechanisms are not implemented. Production apps should implement proper token lifecycle management
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
- The code structure is simplified: Production apps using [intents](https://www.canva.dev/docs/apps/intents/) are recommended to call the prepareDesignEditor function from src/intents/design_editor/index.tsx
