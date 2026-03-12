/**
 * Data Connector intent — reference implementation.
 *
 * A Data Connector lets users generate and autofill a batch of designs
 * using data from your app. For example, a user can select 50 property
 * listings and Canva will produce 50 unique designs — each populated
 * with the listing's name, address, price, and photo.
 *
 * Canva calls two callbacks:
 *
 *  1. `renderSelectionUi` — mounts a React UI where the user configures
 *     which data to import (e.g. filters, search). The selection is
 *     serialized into a `dataSourceRef` so it can be replayed later.
 *  2. `getDataTable` — fetches the actual data rows based on the saved
 *     `dataSourceRef`. Canva calls this both during the initial import
 *     and when the user refreshes the data later.
 *
 * This reference uses hard-coded MLS listing data (see data_table.ts).
 * A real implementation would fetch from an API or database.
 *
 * @see https://www.canva.dev/docs/apps/data-connector/
 */
import "@canva/app-ui-kit/styles.css";
import { AppI18nProvider } from "@canva/app-i18n-kit";
import { AppUiProvider } from "@canva/app-ui-kit";
import type {
  DataConnectorIntent,
  GetDataTableRequest,
  GetDataTableResponse,
  RenderSelectionUiRequest,
} from "@canva/intents/data";
import { createRoot } from "react-dom/client";
import { SelectionUi } from "./selection_ui";
import { getListingsDataTable } from "./data_table";

// Called by Canva to fetch data rows. The `dataSourceRef` contains the
// serialized config from the selection UI (e.g. which property types the
// user chose). `limit` caps the number of rows Canva will accept.
// `signal` allows Canva to abort long-running fetches.
async function getDataTable(
  request: GetDataTableRequest,
): Promise<GetDataTableResponse> {
  const { signal } = request;

  if (signal.aborted) {
    return {
      status: "app_error",
      message: "The data fetch operation was cancelled.",
    };
  }

  try {
    const dataTable = getListingsDataTable(request);
    return {
      status: "completed",
      dataTable,
      // TODO: Update metadata to describe your data source and provider.
      metadata: {
        description: "Real estate property listings",
        providerInfo: { name: "Real Estate MLS" },
      },
    };
  } catch {
    return {
      status: "app_error",
      message: "Failed to fetch listing data.",
    };
  }
}

async function renderSelectionUi(request: RenderSelectionUiRequest) {
  const root = createRoot(document.getElementById("root") as Element);
  root.render(
    <AppI18nProvider>
      <AppUiProvider>
        <SelectionUi {...request} />
      </AppUiProvider>
    </AppI18nProvider>,
  );
}

const dataConnector: DataConnectorIntent = {
  getDataTable,
  renderSelectionUi,
};

export default dataConnector;

if (module.hot) {
  module.hot.accept("./selection_ui");
}
