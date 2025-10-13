# Design audit

Demonstrates how to audit design elements for positioning issues and automatically fix elements that are positioned too close to page edges. Shows how to use the Design Editing API to iterate over every element on all pages of the design.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/design-audit/.

Related examples: See design_interaction/design_editing for other complex design editing workflows using the Design Editing API.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Uses the preview Design Editing API "all_pages" design context. Production apps must not use preview APIs
- Element positioning logic is simplified for demonstration. Production apps should implement comprehensive positioning validation with support for different design types and element constraints
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
