# Drag and drop image

Demonstrates how to implement drag-and-drop functionality for images using ImageCard and startDragToPoint. Shows both external URL and local asset handling with feature detection for different design contexts.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/drag-and-drop-image/.

Related examples: See drag_and_drop/drag_and_drop_video for implementing similar drag-and-drop functionality with video assets, or assets_and_media/asset_upload for direct image import without drag-and-drop.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Static assets are used for demonstration purposes only. Production apps should host assets on a CDN/hosting service and use the `upload` function from the `@canva/asset` package
- ESLint rule `no-restricted-imports` is disabled for example purposes only. Production apps should not disable linting rules without proper justification
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
