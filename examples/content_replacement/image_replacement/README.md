# Image replacement

Demonstrates how to replace selected image elements in a design with new image content. Shows selection detection, image upload, and content replacement patterns for updating existing design elements using the Canva Apps SDK.

For API reference docs and instructions on running this example, see: <https://www.canva.dev/docs/apps/examples/image-replacement/>.

Related examples: See content_replacement/video_replacement for video substitution patterns, or asset_upload for general image import and upload workflows.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Static assets are used for demonstration purposes only. Production apps should host assets on a CDN/hosting service and use the `upload` function from the `@canva/asset` package
- Image format validation is not implemented. Production apps should validate image formats and handle unsupported formats gracefully
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
- Loading states and progress indicators are basic. Production apps should provide detailed progress feedback for long-running operations
