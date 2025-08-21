# App embed elements

Demonstrates how to create embed elements inside app elements, making embeds re-editable with customizable properties like URL, width, and height. Shows how to wrap embed functionality in an app element for enhanced control.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/app-embed-elements/.

Related examples: See design_elements/embed_elements for direct embed insertion, or app_video_elements for video-specific app elements.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Content is hardcoded for demonstration purposes only. Production apps should provide user input interfaces for URL entry and dynamic content loading
- Input validation and sanitization is simplified for demonstration. Production apps must implement comprehensive URL validation and error handling for invalid embed URLs
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
