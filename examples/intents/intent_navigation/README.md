# Intent Navigation

This example demonstrates how to structure an app to implement multiple intents in the same code and how to launch the content publisher and the data connector in bulk create from the design editor intent. The app is a combination of the design editor starter example, the data connector example and the content publisher example, with `bulkCreate.launch()` and `publish.launch()` calls.

It is recommended to walk through the `implement_multiple_intents` example, to understand the concept of multiple intents in the same code, before stepping into navigating between intents.

Similar to the `implement_multiple_intents` example, the root index file `src/index.tsx` calls the prepare function for each implemented intent.

There's a `src/intents` folder, and within this folder there's one folder for each implemented intent. The index file of these folders implements the intent contract.

For example, `src/index.tsx` calls `prepareDesignEditor` with the `DesignEditorIntent` implementation imported from `src/intents/design_editor/index.tsx`, calls `prepareDataConnector` with the `DataConnectorIntent` implementation imported from `src/intents/data_connector/index.tsx`, and calls `prepareContentPublisher` with the `ContentPublisherIntent` implementation imported from `src/intents/content_publisher/index.tsx`.

In `src/intents/design_editor/index.tsx`, there are 2 buttons to launch the bulk create with data connector intent and to launch publish with content publisher intent. There is no way to launch any intent from inside the data connector intent or the content publisher intent, as an error will be thrown.

This example also has a `canva-app.json` app config file with all related intents enrolled.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Accessibility features aren't fully implemented. Production apps must meet WCAG 2.0 AA standards with proper keyboard navigation and ARIA labels
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
