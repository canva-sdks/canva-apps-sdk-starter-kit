# App image elements

Demonstrates how to create image elements inside app elements, making them re-editable with controllable properties like dimensions and rotation. Users can select from predefined images and customize their appearance within the app element container.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/app-image-elements/.

Related examples: See app_video_elements for videos within app elements, or design_elements/image_elements for direct image insertion.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Static assets are used for demonstration purposes only. Production apps should host assets on a CDN/hosting service and use the `upload` function from the `@canva/asset` package
- ESLint rule `no-restricted-imports` is disabled for example purposes only. Production apps should not disable linting rules without proper justification
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
