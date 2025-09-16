# Video replacement

Demonstrates how to replace selected video elements in a design with new video content. Shows selection detection, video upload, and content replacement patterns for updating existing design elements.

For API reference docs and instructions on running this example, see: <https://www.canva.dev/docs/apps/examples/video-replacement/>.

Related examples: See content_replacement/image_replacement for image substitution, or asset_upload for general video import patterns.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Static assets are used for demonstration purposes only. Production apps should host assets on a CDN/hosting service and use the `upload` function from the `@canva/asset` package
- Video format validation is not implemented. Production apps should validate video formats and handle unsupported formats gracefully
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
