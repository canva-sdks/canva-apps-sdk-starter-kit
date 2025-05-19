import type {
  RenderSelectionUiParams,
  FetchDataTableParams,
  FetchDataTableResult,
} from "@canva/intents/data";
import { prepareDataConnector } from "@canva/intents/data";
import { Alert, AppUiProvider } from "@canva/app-ui-kit";
import { createRoot } from "react-dom/client";
import { DataSelectionUI } from "./data_selection_ui";
import "@canva/app-ui-kit/styles.css";
import { fetchRealEstateData } from "./data";

const root = createRoot(document.getElementById("root") as Element);

prepareDataConnector({
  /**
   * Fetches structured data from an external source.
   *
   * This action is called in two scenarios:
   *
   * - During data selection to preview data before import (when {@link RenderSelectionUiParams.updateDataRef} is called).
   * - When refreshing previously imported data (when the user requests an update).
   *
   * @param params - Parameters for the data fetching operation.
   * @returns A promise resolving to either a successful result with data or an error.
   */
  fetchDataTable: async (
    params: FetchDataTableParams,
  ): Promise<FetchDataTableResult> => {
    try {
      const dataTable = await fetchRealEstateData(params);
      if (dataTable != null) {
        return {
          status: "completed",
          dataTable,
        };
      } else {
        throw new Error();
      }
    } catch {
      return {
        status: "app_error",
        message: `Unknown dataSourceRef "${params.dataSourceRef}"`,
      };
    }
  },

  /**
   * Renders a UI component for selecting and configuring data from external sources.
   * This UI should allow users to browse data sources, apply filters, and select data.
   * When selection is complete, the implementation must call the `updateDataRef`
   * callback provided in the params to preview and confirm the data selection.
   *
   * @param params - parameters that provide context and configuration for the data selection UI.
   * Contains invocation context, size limits, and the updateDataRef callback
   */
  renderSelectionUi: async (params: RenderSelectionUiParams) => {
    root.render(
      <AppUiProvider>
        <DataSelectionUI {...params} />
      </AppUiProvider>,
    );
  },
});

// TODO: Fallback message if you have not turned on the data connector intent.
// You can remove this once your app is correctly configured.
root.render(
  <AppUiProvider>
    <Alert tone="critical">
      If you're seeing this, you need to turn on the data connector intent in
      the developer portal for this app.
    </Alert>
  </AppUiProvider>,
);
