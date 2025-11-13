# Content publisher intent

This example demonstrates how to use the Content Publisher intent to publish Canva designs to external platforms. It shows a social media publishing use case with posts.

For API reference docs and instructions on running this example, see: <https://www.canva.dev/docs/apps/content-publisher/>.

## What this example demonstrates

- **App Settings UI**: Platform-specific publishing settings (caption configuration)
- **App Preview UI**: Visual preview showing how the design will appear on your platform
- **Output types**: Configuring different publishing formats (social media posts)
- **Publish content**: Example implementation of the `publishContent` callback

## Implementation notes

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- **Static user data**: This example uses hardcoded usernames and avatar data. Production apps should fetch real user data from your platform's API.
- **API integration**: This example uses mock data. Production apps need to implement proper API authentication, rate limiting, and error handling for the `publishContent` callback.
- **Localization**: Text content is hardcoded in English. Production apps should implement proper internationalization using the `@canva/app-i18n-kit` package for multi-language support.
- **Error handling**: Production apps should have comprehensive error handling for network failures, API errors, and edge cases.
- **Validation**: Production apps should implement platform-specific validation (e.g., caption length limits, aspect ratio requirements).
