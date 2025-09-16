# App shape elements

This example demonstrates how to create custom vector shape elements inside app elements using SVG path data. It shows shape creation, color customization, and path manipulation for building reusable custom shapes.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/app-shape-elements/.

Related examples: See `design_elements/shape_elements` for direct shape insertion, or `app_element_children` for multiple shapes within app elements.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Content is hardcoded for demonstration purposes only. Production apps should provide user input interfaces or dynamic content loading and user-friendly shape creation and editing interfaces
- Path validation and error handling is simplified for demonstration. Production apps must validate SVG paths and handle malformed path data gracefully
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
