import "@canva/app-ui-kit/styles.css";
import type {
  DataConnectorIntent,
  GetDataTableRequest,
  GetDataTableResponse,
  RenderSelectionUiRequest,
} from "@canva/intents/data";
import { auth } from "@canva/user";
import { createRoot } from "react-dom/client";
import { buildDataTableResult, scope } from "../../api";
import { App } from "./app";

const dataConnector: DataConnectorIntent = {
  /**
   * Fetches structured data from an external source.
   *
   * This action is called in two scenarios:
   *
   * - During data selection to preview data before import (when {@link RenderSelectionUiRequest.updateDataRef} is called).
   * - When refreshing previously imported data (when the user requests an update).
   *
   * @param params - Parameters for the data fetching operation.
   * @returns A promise resolving to either a successful result with data or an error.
   */
  getDataTable: async (
    params: GetDataTableRequest,
  ): Promise<GetDataTableResponse> => {
    const oauth = auth.initOauth();
    const token = await oauth.getAccessToken({ scope });
    return buildDataTableResult(params, token?.token);
  },

  /**
   * Renders a UI component for selecting and configuring data from external sources.
   * This UI should allow users to browse data sources, apply filters, and select data.
   * When selection is complete, the implementation must call the `updateDataRef`
   * callback provided in the params to preview and confirm the data selection.
   *
   * @param request - parameters that provide context and configuration for the data selection UI.
   * Contains invocation context, size limits, and the updateDataRef callback
   */
  renderSelectionUi: async (request: RenderSelectionUiRequest) => {
    function render() {
      const root = createRoot(document.getElementById("root") as Element);
      root.render(<App request={request} />);
    }

    render();

    if (module.hot) {
      module.hot.accept("./app", render);
      module.hot.accept("../../api", render);
    }
  },
};
export default dataConnector;
