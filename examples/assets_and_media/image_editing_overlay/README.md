# Image editing overlay

Demonstrates how to use image editing overlays to create simple interactive image editing experiences. Shows real-time preview of basic image effects, communication between overlay and object panel, and saving edited images back to the design.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/image-editing-overlay/.

Related examples: See assets_and_media/asset_upload for image importing, or design_elements/image_elements for basic image manipulation patterns.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- ESLint rule `no-console` is disabled for example purposes only. Production apps shouldn't disable linting rules without proper justification
- Image effects are simplified for demonstration. Production apps should implement more sophisticated image processing and comprehensive error handling
- Internationalization isn't implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
- The example uses basic image effects. Production apps should consider offering customizable parameters (e.g., blur radius, effect intensity) for better user experience
