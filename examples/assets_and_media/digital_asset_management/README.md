# Digital asset management

Demonstrates how to integrate with external digital asset management systems using SearchableListView. Shows patterns for browsing, searching, and importing assets from third-party platforms while supporting design export.

For API reference docs and instructions on running this example, see: <https://www.canva.dev/docs/apps/examples/digital-asset-management/>.

Related examples: See asset_upload for direct asset upload patterns, or content_replacement examples for asset substitution workflows.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- **Static assets**: Mock image URLs from Pexels are used for demonstration. Production apps should use proper CDN/hosting services and implement the `upload` function from `@canva/asset` package for uploading assets to Canva
- **Authentication and API integration**: Mock data and placeholder functions are used. Production apps must implement proper user authentication, secure API integration with external platforms, and comply with third-party service terms of service
- **Error handling**: Simplified error handling is used for demonstration. Production apps must implement comprehensive error handling with clear user feedback, proper logging, and graceful failure modes
- **CORS configuration**: The example uses permissive CORS settings (`cors()` with no restrictions). Production apps must implement proper CORS policies restricting origins to specific app domains
- **Console logging**: ESLint rule `no-console` is disabled for debugging purposes. Production apps should replace console statements with proper logging solutions and avoid disabling linting rules without justification
- **Localization**: While the example shows basic locale usage, production apps must implement complete internationalization using the `@canva/app-i18n-kit` package to support multiple languages as required for Canva review
