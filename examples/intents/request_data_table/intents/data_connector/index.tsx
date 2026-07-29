// For usage information, see the README.md file.
import type {
  DataConnectorIntent,
  GetDataTableRequest,
  GetDataTableResponse,
  RenderSelectionUiRequest,
} from "@canva/intents/data";
import { AppUiProvider } from "@canva/app-ui-kit";
import "@canva/app-ui-kit/styles.css";
import { createRoot } from "react-dom/client";
import { buildDataTable, TEAM_MEMBERS } from "../../data";
import { SelectionUI } from "./selection_ui";

/**
 * Returns the app's fixed team-directory dataset.
 *
 * A real Data Connector would use `request.dataSourceRef.source` to identify
 * which data to fetch from an external source.
 */
async function getDataTable(
  request: GetDataTableRequest,
): Promise<GetDataTableResponse> {
  return {
    status: "completed",
    dataTable: buildDataTable(TEAM_MEMBERS),
    metadata: {
      description: "Team directory",
      providerInfo: { name: "Team Directory" },
    },
  };
}

function renderSelectionUi(request: RenderSelectionUiRequest) {
  const root = createRoot(document.getElementById("root") as Element);
  root.render(
    <AppUiProvider>
      <SelectionUI {...request} />
    </AppUiProvider>,
  );
}

const dataConnector: DataConnectorIntent = { getDataTable, renderSelectionUi };
export default dataConnector;
