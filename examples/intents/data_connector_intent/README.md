# Data connector intent

This example demonstrates how to build a data connector intent app that allows users to import structured data from external sources into Canva designs. The app shows how to implement both the data fetching logic and the selection UI for filtering and configuring data imports.

For API reference docs and instructions on running this example, see: <https://www.canva.dev/docs/apps/examples/data-connector-intent/>.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- **Static assets**: This example uses static Canva-hosted URLs for media content. Production apps should use CDN/hosting services and implement the `upload` function from `@canva/asset` package for real media uploads.
- **Localization**: Text content is hardcoded in English. Production apps require proper internationalization using the `@canva/app-i18n-kit` package for multi-language support.
- **Data validation**: The example assumes well-formed data responses. Production apps should implement robust data validation and sanitization.
- **API integration**: This example uses mock data. Production apps need to implement proper API authentication, rate limiting, and error handling for external data sources.
