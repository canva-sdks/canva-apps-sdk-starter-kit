# Brand templates

Demonstrates the brand template workflow: choose a brand template with `requestBrandTemplates`, then send its token to a backend, where `brandTemplate.verifyToken()` from `@canva/app-middleware` verifies the token and decodes it into the real brand template ID. That ID — not the raw token — is what's used to preview the template's dataset fields with `getBrandTemplateMetadata` and apply it to the current design with `applyTemplate`, both from `@canva/design`. The backend also uses the ID to track how many times the template has been applied.

For API reference docs and instructions on running this example, see: https://www.canva.dev/docs/apps/examples/brand-templates/.

This example requires a backend with a valid `CANVA_APP_ID` configured in the root `.env` file. See [Running an example's backend](../../../README.md#running-an-examples-backend) for setup instructions.

Related examples: See design_interaction/design_token for the equivalent pattern of verifying a token on the backend, or design_interaction/design_template_metadata for retrieving metadata about the templates used to create a design (a different, more mature API than the brand template APIs used here).

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- **Preview/beta API**: `requestBrandTemplates`, `getBrandTemplateMetadata`, `applyTemplate`, and the brand template token verifier from `@canva/app-middleware` are `@beta` APIs — not yet guaranteed stable, and not suitable for production apps without checking the latest API status in the docs
- **In-memory database**: Uses a simple in-memory storage for demonstration. Production apps should use persistent database solutions like PostgreSQL, MongoDB, or similar
- **CORS configuration**: Uses permissive CORS settings. Production apps must restrict CORS to only allow requests from your app's specific origin (https://app-{app-id}.canva-apps.com)
- **Token management**: Token usage patterns are simplified for demonstration purposes. Production apps should implement proper token refresh mechanisms, secure backend communication, and appropriate rate limiting for API calls
- **Error handling**: Error handling is simplified for demonstration. Production apps must implement comprehensive error handling with clear user feedback and graceful failure modes
- **Internationalization**: Not implemented in this example. Production apps must support multiple languages using the `@canva/app-i18n-kit` package to pass Canva review requirements
- **Code structure**: Production apps using [intents](https://www.canva.dev/docs/apps/intents/) are recommended to call the prepareDesignEditor function from src/intents/design_editor/index.tsx
