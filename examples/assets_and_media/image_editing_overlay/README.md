# Image editing overlay

Demonstrates how to create an overlay interface for editing selected images in a design. Shows surface detection for rendering different components based on whether the app is in the object panel or image overlay context.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/image-editing-overlay/.

Related examples: See assets_and_media/asset_upload for general asset handling, or other overlay examples in the apps ecosystem.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- State management across surfaces is basic for demonstration. Production apps should implement proper state management and data persistence
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
