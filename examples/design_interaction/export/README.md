# Design export

Demonstrates how to export designs in various formats (PNG, PDF, JPG, GIF, SVG, video, PPTX) using requestExport. Shows export configuration, file format selection, and export response handling.

For API reference docs and instructions on running this example, see: <https://www.canva.dev/docs/apps/examples/export/>.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Console.log statements are used for debugging purposes but should be replaced with proper error handling and logging in production apps
- ESLint rule `no-console` is disabled for example purposes only. Production apps should not disable linting rules without proper justification
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Progress indicators are not implemented. Production apps should provide visual feedback during long-running operations like exports
- The export response is displayed directly in the UI. Production apps should send export URLs to backend services for processing
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
