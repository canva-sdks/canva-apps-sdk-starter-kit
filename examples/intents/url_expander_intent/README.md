# URL expander intent

This example demonstrates how to build a URL expander intent app that allows users to paste URLs from external platforms and have the app automatically fetch and import the associated assets into Canva designs. The app shows how to implement both the URL expansion logic and content retrieval for various asset types.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/url-expander-intent/.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- **Static assets**: This example uses static Canva-hosted URLs for media content. Production apps should use CDN/hosting services and implement the `upload` function from `@canva/asset` package for real media uploads.
- **OAuth authentication**: The example includes commented-out OAuth patterns but doesn't implement actual authentication. Production apps should implement proper OAuth flows using the `@canva/app-oauth` package to access user data from external platforms.
- **API integration**: This example uses mock data. Production apps need to implement proper API authentication, rate limiting, and error handling for external data sources.
- **Localization**: Text content is hardcoded in English. Production apps require proper internationalization using the `@canva/app-i18n-kit` package for multi-language support.
- **Error handling**: Production apps should have comprehensive error handling for network failures, API errors, invalid URLs, and unsupported asset types.
- **Code structure**: The code structure is simplified. Production apps using [intents](https://www.canva.dev/docs/apps/intents/) are recommended to call the prepareUrlExpander function from src/intents/url_expander/index.tsx
