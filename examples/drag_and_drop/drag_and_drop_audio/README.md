# Drag and drop audio

This example demonstrates how to implement drag-and-drop functionality for audio files using AudioCard and startDragToPoint. It shows audio upload, playback preview, and design integration patterns.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/drag-and-drop-audio/.

Related examples: See drag_and_drop/drag_and_drop_video for video drag-and-drop patterns, or asset_upload for direct audio import without drag-and-drop.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Static assets are used for demonstration purposes only. Production apps should host assets on a CDN/hosting service and use the `upload` function from the `@canva/asset` package
- Audio format validation is not implemented. Production apps should validate audio formats and handle unsupported audio types gracefully
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
