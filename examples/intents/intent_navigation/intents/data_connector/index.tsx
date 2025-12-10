import type {
  DataConnectorIntent,
  GetDataTableRequest,
  GetDataTableResponse,
  RenderSelectionUiRequest,
} from "@canva/intents/data";
import { createRoot } from "react-dom/client";
import { AppUiProvider, Rows, Text } from "@canva/app-ui-kit";
import * as styles from "styles/components.css";

// This example demonstrates how to launch Content Publisher Intent and Bulk Create with Data Connector Intent from within a Design Editor Intent.
// For a more detailed example of the Data Connector Intent, refer to the data_connector_intent example.

// Fetches data from external sources, transforms and returns the Canva's DataTable format
async function getDataTable(
  request: GetDataTableRequest,
): Promise<GetDataTableResponse> {
  const { signal } = request;

  // Check if the operation has been aborted.
  if (signal.aborted) {
    return {
      status: "app_error",
      message: "The data fetch operation was cancelled.",
    };
  }

  return {
    status: "completed",
    dataTable: {
      rows: [{ cells: [{ type: "string", value: "Fetched data" }] }],
    },
  };
}

// Renders a UI component for selecting and configuring data from external sources.
async function renderSelectionUi(
  request: RenderSelectionUiRequest,
): Promise<void> {
  const root = createRoot(document.getElementById("root") as Element);

  root.render(
    <AppUiProvider>
      <div className={styles.scrollContainer}>
        <Rows spacing="2u">
          <Text>
            This is the data connector intent portion of the app. Here you would
            render an interface for controlling the data table.
          </Text>
        </Rows>
      </div>
    </AppUiProvider>,
  );
}

const dataConnector: DataConnectorIntent = {
  getDataTable,
  renderSelectionUi,
};

export default dataConnector;
