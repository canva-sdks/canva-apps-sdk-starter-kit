# Page background

Demonstrates how to set page backgrounds using solid colors, images, and videos. Shows background customization, asset upload for backgrounds, and background type handling.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/page-background/.

Related examples: See design_interaction/page_addition for creating new pages, or asset_upload for general asset handling patterns.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Static assets are used for demonstration purposes only. Production apps should host assets on a CDN/hosting service and use the `upload` function from the `@canva/asset` package
- Asset validation is simplified for demonstration. Production apps should validate background assets and handle unsupported formats gracefully
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
