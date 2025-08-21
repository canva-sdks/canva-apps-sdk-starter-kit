# App video elements

Demonstrates how to create video elements inside app elements, making them re-editable with controllable properties like dimensions and rotation. Users can select from predefined videos and customize their appearance.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/app-video-elements/.

Related examples: See app_image_elements for images within app elements, or design_elements/video_elements for direct video insertion.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Static video URLs are used for demonstration purposes only. Production apps should host videos on a CDN/hosting service and use the `upload` function from the `@canva/asset` package for user uploads
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
