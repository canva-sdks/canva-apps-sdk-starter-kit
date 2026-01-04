# Implement Multiple intents

This example demonstrates how to structure an app to implement multiple intents in the same code. The app is a combination of the design editor starter example and the content publisher example.

This example demonstrates our recommeneded code structure for multiple intent apps. The root index file `src/index.tsx` calls the prepare function for each implemented intent.

There's a `src/intents` folder, and within this folder there's one folder for each implemented intent. The index file of these folders implements the intent contract.

For example, `src/index.tsx` calls `prepareDesignEditor` with the `DesignEditorIntent` implementation imported from `src/intents/design_editor/index.tsx`, and calls `prepareContentPublisher` with the `ContentPublisherIntent` implementation imported from `src/intents/content_publisher/index.tsx`.

This example has a `canva-app.json` app config file with both intents enrolled.

For API reference docs and instructions on running this example, see: <https://www.canva.dev/docs/apps/examples/multiple-intents/>.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Accessibility features aren't fully implemented. Production apps must meet WCAG 2.0 AA standards with proper keyboard navigation and ARIA labels
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
