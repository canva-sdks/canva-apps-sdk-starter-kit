# Video elements

Demonstrates how to add video elements to designs using predefined video assets. Shows video selection, upload handling, and video insertion with thumbnail previews.

For API reference docs and instructions on running this example, see: <https://www.canva.dev/docs/apps/examples/video-elements/>.

Related examples:

- `app_video_elements` - For embedding videos within app elements
- `drag_and_drop/drag_and_drop_video` - For drag-and-drop video insertion patterns

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Static assets are used for demonstration purposes only. Production apps should host assets on a CDN/hosting service and use the `upload` function from the `@canva/asset` package
- Video format validation is not implemented. Production apps must validate video formats, dimensions, and file sizes
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
