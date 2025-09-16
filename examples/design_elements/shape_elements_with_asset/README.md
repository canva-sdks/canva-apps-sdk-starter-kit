# Shape elements with asset fill

Demonstrates how to create custom shape elements filled with image assets. Shows combining vector paths with image fills to create unique design elements with both shape and image properties.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/shape-elements-with-asset/.

Related examples: See design_elements/shape_elements for solid color shapes, or design_elements/image_elements for standalone image insertion.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Static assets are used for demonstration purposes only. Production apps should host assets on a CDN/hosting service and use the `upload` function from the `@canva/asset` package
- Asset format validation is not implemented. Production apps should validate asset formats and handle unsupported formats gracefully
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
- The `no-console` ESLint rule is disabled for console.log statements used for debugging purposes to demonstrate upload completion events
