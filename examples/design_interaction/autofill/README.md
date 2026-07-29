# Autofill

This example demonstrates how to match data fields and autofill the current
design using `requestDataFieldMatching` and `autofillDesign` from
`@canva/design`, against a hardcoded data table (no Data Connector needed).
The hardcoded table is typed with the `DataTable` type from `@canva/intents/data`
— the same `DataTable` shape a Data Connector's `getDataTable` would return.

The app implements a single **Design Editor** intent. It reads the design's
currently tagged fields with `getDesignMetadata`. "Match data fields" calls
`requestDataFieldMatching` with a small hardcoded sample table so the user can
match this app's field labels ("Name", "Role", "Location") against tagged
elements in the design. "Autofill design" calls `autofillDesign` with the same
hardcoded table to fill in those tagged elements.

For API reference docs and instructions on running this example, see:
<https://www.canva.dev/docs/apps/examples/autofill/>.

Related examples: see `intents/request_data_table` for fetching a data table
from a Data Connector instead of a hardcoded one, and `design_interaction/brand_templates`
for selecting and applying a brand template before autofilling it.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- **Preview/beta API**: `autofillDesign` and `getDesignMetadata` are `@beta`
  APIs, and `requestDataFieldMatching` isn't yet available in this example's
  pinned `@canva/design` version — it will ship in a subsequent beta release.
  Check the latest API status in the docs before relying on these in a
  production app.
- **Static/hardcoded data**: The data used for matching and autofilling is a
  fixed, hardcoded table. Production apps should use real data, typically
  fetched from a Data Connector (see `intents/request_data_table`) or an
  external API.
- **Localization**: Text content is hardcoded in English. Production apps
  require proper internationalization using the `@canva/app-i18n-kit` package
  for multi-language support.
- **Error handling**: Error handling is simplified for demonstration.
  Production apps must implement comprehensive error handling with clear user
  feedback and graceful failure modes.
