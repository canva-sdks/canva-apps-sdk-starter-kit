# Fetch API integration

Demonstrates how to make authenticated HTTP requests to external backends using user tokens. Shows proper authentication patterns, error handling, and data retrieval from custom APIs.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/fetch/.

Related examples: See design_interaction/design_token for design-specific API access, or fundamentals/authentication for user authentication patterns.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Console.log statements are used for debugging purposes but should be replaced with proper error handling and logging in production apps
- ESLint rule `no-console` is disabled for example purposes only. Production apps should not disable linting rules without proper justification
- Error handling for network requests is simplified for demonstration. Production apps must implement comprehensive error handling with retry logic and user feedback
- Loading states and progress indicators are not implemented. Production apps should provide visual feedback during API calls
- Token management and security is simplified for demonstration. Production apps must implement secure token storage and rotation
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
