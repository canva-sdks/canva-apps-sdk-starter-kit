# Positioning elements

Demonstrates how to position elements at specific coordinates and placements within designs. Shows element positioning patterns, placement configurations, and coordinate-based element insertion.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/positioning-elements/.

Related examples: See design_interaction/design_editing for advanced element manipulation, or app_element_children for relative positioning within app elements.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Static assets are used for demonstration purposes only. Production apps should host assets on a CDN/hosting service and use the `upload` function from the `@canva/asset` package
- ESLint rule `no-restricted-imports` is disabled for example purposes only. Production apps should not disable linting rules without proper justification
- Positioning coordinate validation is simplified for demonstration. Production apps should validate positioning coordinates and handle different page types appropriately
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
