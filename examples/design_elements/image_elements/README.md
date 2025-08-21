# Image elements example

This example demonstrates how to add image elements to a design.
For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/image-elements/.

See also the App image elements example: https://www.canva.dev/docs/apps/examples/app-image-elements/. Using app elements instead of regular design elements allows for more complex app interactions and behaviors.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Static assets are used for demonstration purposes only. Production apps should host assets on a CDN/hosting service and use the `upload` function from the `@canva/asset` package
- ESLint rule `no-restricted-imports` is disabled for example purposes only. Production apps should not disable linting rules without proper justification
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
