# Drag and drop embed

Demonstrates how to implement drag-and-drop functionality for embed elements using EmbedCard and startDragToPoint. Shows embed URL handling, preview configuration, and design integration with feature detection.

For API reference docs and instructions on running this example, see: <https://www.canva.dev/docs/apps/examples/drag-and-drop-embed/>.

Related examples: See design_elements/embed_elements for direct embed insertion, or drag_and_drop/drag_and_drop_video for video drag-and-drop patterns.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Content is hardcoded for demonstration purposes only. Production apps should provide user input interfaces or dynamic content loading
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- URL validation and sanitization is not implemented. Production apps should validate embed URLs and handle invalid URLs gracefully
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
