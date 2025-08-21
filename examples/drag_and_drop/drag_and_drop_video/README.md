# Drag and drop video

Demonstrates how to implement drag-and-drop functionality for video files using VideoCard and startDragToPoint. Shows video upload, thumbnail previews, and design integration with feature detection.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/drag-and-drop-video/.

Related examples: See drag_and_drop/drag_and_drop_image for image drag-and-drop, or asset_upload for direct video import.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Static assets are used for demonstration purposes only. Production apps should host assets on a CDN/hosting service and use the `upload` function from the `@canva/asset` package
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Video format validation and thumbnail generation is not implemented. Production apps should validate video formats and provide proper thumbnail generation
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
