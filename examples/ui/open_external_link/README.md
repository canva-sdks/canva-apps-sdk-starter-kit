# Open external links

Demonstrates how to handle external link navigation with proper user consent and security patterns. Shows the use of `requestOpenExternalUrl` API, user confirmation workflows, and compliance with external navigation guidelines.

For API reference docs and instructions on running this example, see: <https://www.canva.dev/docs/apps/examples/open-external-link/>.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- Error handling is simplified for demonstration purposes. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes when external URL requests fail
- Internationalization is not implemented. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
