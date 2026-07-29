# Request data table

This example demonstrates how to use `requestDataTable` from `@canva/intents/data` to
fetch a `DataTable` from an app's own Data Connector directly from the design editor
intent, without the user having to leave the design editor experience.

The app implements two intents:

- **Data Connector** (`intents/data_connector`) — exposes a small, fixed team-directory
  dataset as a Data Connector data source.
- **Design Editor** (`intents/design_editor`) — a single "Get data" button that calls
  `requestDataTable({ withDataConnector: "self", dataSelectionDisplay: "show" })`, which
  opens the Data Connector's selection UI and resolves with the `DataTable` the user
  loads, then renders it as a simple table.

For API reference docs and instructions on running this example, see:
<https://www.canva.dev/docs/apps/examples/request-data-table/>.

Related examples: see `intents/data_connector_intent` for a fuller Data Connector
implementation (search, filtering, multiple data sources), and
`intents/implement_multiple_intents` for the general pattern of combining multiple
intents in one app.

NOTE: This example differs from what is expected for public apps to pass a Canva review:

- **Preview/beta API**: `requestDataTable` is a `@beta` API. Check the latest API
  status in the docs before relying on it in a production app.
- **Static/hardcoded data**: The Data Connector always returns the same fixed dataset.
  Production apps should use `request.dataSourceRef.source` to identify and fetch the
  actual data requested from an external source.
- **Localization**: Text content is hardcoded in English. Production apps require
  proper internationalization using the `@canva/app-i18n-kit` package for multi-language
  support.
- **Error handling**: Error handling is simplified for demonstration. Production apps
  must implement comprehensive error handling with clear user feedback and graceful
  failure modes.
