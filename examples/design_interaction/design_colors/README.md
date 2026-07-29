# Design colors

Demonstrates how to retrieve the colors currently used in the design.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/design-colors/.

Related examples: See `design_interaction/design_metadata` for reading other design information, or `ui/color` for opening Canva's built-in color selector.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Uses the preview `getDesignColors` API. Production apps must not use preview APIs
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
- The code structure is simplified: Production apps using [intents](https://www.canva.dev/docs/apps/intents/) are recommended to call the `prepareDesignEditor` function from `src/intents/design_editor/index.tsx`
