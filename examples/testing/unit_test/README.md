# Unit testing

Demonstrates how to structure app logic for unit testing, including testable functions, error handling, and API interaction patterns. Shows separation of concerns for better testability.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/unit-test/.

Related example: See testing/ui_test for testing UI components separately from business logic.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
