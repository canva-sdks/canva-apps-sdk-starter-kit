# Asset upload

Demonstrates how to upload and import various media types (images, videos, audio) into Canva designs using the upload function. Shows asynchronous upload handling, thumbnail support, and design type compatibility checks.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/asset-upload/.

Related examples: See digital_asset_management for external asset browsing, or drag_and_drop examples for alternative asset insertion patterns.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Static assets are used for demonstration purposes only. Production apps should host assets on a CDN/hosting service and use the `upload` function from the `@canva/asset` package
- Console.log statements are used for debugging purposes but should be replaced with proper error handling and logging in production apps
- ESLint rule `no-console` is disabled for example purposes only. Production apps should not disable linting rules without proper justification
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
