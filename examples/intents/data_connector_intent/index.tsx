// For usage information, see the README.md file.
import type {
  DataConnectorIntent,
  RenderSelectionUiRequest,
  GetDataTableRequest,
  GetDataTableResponse,
} from "@canva/intents/data";
import { prepareDataConnector } from "@canva/intents/data";
import { AppUiProvider } from "@canva/app-ui-kit";
import { createRoot } from "react-dom/client";
import { SelectionUI } from "./selection_ui";
import "@canva/app-ui-kit/styles.css";
import { getRealEstateData } from "./data";

/**
 * Gets structured data from an external source.
 *
 * This action is called in two scenarios:
 *
 * - During data selection to preview data before import (when {@link RenderSelectionUiRequest.updateDataRef} is called).
 * - When refreshing previously imported data (when the user requests an update).
 *
 * @param request - Parameters for the data fetching operation.
 * @returns A promise resolving to either a successful result with data or an error.
 */
async function getDataTable(
  request: GetDataTableRequest,
): Promise<GetDataTableResponse> {
  try {
    const dataTable = await getRealEstateData(request);
    return {
      status: "completed",
      dataTable,
      metadata: {
        description: "Sydney construction project sales in each release stage",
        providerInfo: { name: "Demo Sales API" },
      },
    };
  } catch {
    return {
      status: "app_error",
      message: "Failed to process data request",
    };
  }
}

/**
 * Renders a UI component for selecting and configuring data from external sources.
 * This UI should allow users to browse data sources, apply filters, and select data.
 * When selection is complete, the implementation must call the `updateDataRef`
 * callback provided in the params to preview and confirm the data selection.
 *
 * @param request - parameters that provide context and configuration for the data selection UI.
 * Contains invocation context, size limits, and the updateDataRef callback
 */
async function renderSelectionUi(request: RenderSelectionUiRequest) {
  const root = createRoot(document.getElementById("root") as Element);
  root.render(
    <AppUiProvider>
      <SelectionUI {...request} />
    </AppUiProvider>,
  );
}

// Configure the data connector intent with required callbacks
const dataConnector: DataConnectorIntent = {
  getDataTable,
  renderSelectionUi,
};
prepareDataConnector(dataConnector);
