# Digital asset management

Demonstrates how to integrate with external digital asset management systems using SearchableListView. Shows patterns for browsing, searching, and importing assets from third-party platforms while supporting design export.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/digital-asset-management/.

Related examples: See asset_upload for direct asset upload patterns, or content_replacement examples for asset substitution workflows.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Console.log statements are used for debugging purposes but should be replaced with proper error handling and logging in production apps
- ESLint rule `no-console` is disabled for example purposes only. Production apps should not disable linting rules without proper justification
- Mock data and placeholder functions are used for demonstration purposes only. Production apps should implement proper authentication, real API integration, and compliance with external platform terms of service
- Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
