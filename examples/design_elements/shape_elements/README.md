# Shape elements

Demonstrates how to create custom vector shape elements using SVG path data. Shows shape creation, color customization, multiple path support, and viewBox configuration for building custom graphics.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/shape-elements/.

Related examples: See design_elements/shape_elements_with_asset for image-filled shapes, or app_shape_elements for shapes within app elements.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Path validation and error handling is simplified for demonstration. Production apps must validate SVG paths and handle malformed path data gracefully
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
