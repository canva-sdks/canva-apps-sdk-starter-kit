import type {
  RenderSelectionUiRequest,
  GetDataTableRequest,
  GetDataTableResponse,
  DataTable,
} from "@canva/intents/data";
import { prepareDataConnector } from "@canva/intents/data";
import { AppUiProvider, Alert } from "@canva/app-ui-kit";
import { createRoot } from "react-dom/client";
import { SelectionUI } from "./selection_ui";
import "@canva/app-ui-kit/styles.css";
import type { DataSourceConfig } from "./data_transformer";
import {
  transformAgentToDataTable,
  transformListingToDataTable,
  transformMarketDataToDataTable,
} from "./data_transformer";

const root = createRoot(document.getElementById("root") as Element);

// Base API URL
const BASE_URL = "https://api.theagencymiddleware.io/v1";

/**
 * Fetch agent profile data from the API
 */
async function fetchAgentData(email: string, token?: string): Promise<Record<string, unknown> | null> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${BASE_URL}/agent/public-profile?email=${encodeURIComponent(email)}`,
      { method: "GET", headers }
    );

    if (!response.ok) {
      console.error("Failed to fetch agent data:", response.status);
      return null;
    }

    const data = await response.json();
    return data?.result?.rows?.[0] || null;
  } catch (error) {
    console.error("Error fetching agent data:", error);
    return null;
  }
}

/**
 * Fetch listing data from the API
 */
async function fetchListingData(listingId: string, token?: string): Promise<Record<string, unknown> | null> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${BASE_URL}/listings/data?listing_id=${encodeURIComponent(listingId)}`,
      { method: "GET", headers }
    );

    if (!response.ok) {
      console.error("Failed to fetch listing data:", response.status);
      return null;
    }

    const data = await response.json();
    return data?.result || null;
  } catch (error) {
    console.error("Error fetching listing data:", error);
    return null;
  }
}

/**
 * Fetch market data from the API
 */
async function fetchMarketData(
  suburbPostcode: string,
  token?: string
): Promise<{
  house: Record<string, unknown>;
  unit: Record<string, unknown>;
  labels: Array<{ property: string; label: string; format: string }>;
  month_end?: string;
} | null> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${BASE_URL}/market/data?suburbpostcode=${encodeURIComponent(suburbPostcode)}`,
      { method: "GET", headers }
    );

    if (!response.ok) {
      console.error("Failed to fetch market data:", response.status);
      return null;
    }

    const data = await response.json();
    const output = data?.result?.output;

    if (output?.house && output?.unit && output?.labels) {
      return {
        house: output.house,
        unit: output.unit,
        labels: output.labels,
        month_end: output.month_end,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching market data:", error);
    return null;
  }
}

/**
 * Get the auth token from localStorage (set by the main app)
 */
function getAuthToken(): string | null {
  try {
    return localStorage.getItem("middleware_api_token");
  } catch {
    return null;
  }
}

prepareDataConnector({
  /**
   * Gets structured data from an external source.
   *
   * This action is called in two scenarios:
   *
   * - During data selection to preview data before import (when updateDataRef is called).
   * - When refreshing previously imported data (when the user requests an update).
   */
  getDataTable: async (
    request: GetDataTableRequest
  ): Promise<GetDataTableResponse> => {
    try {
      const { dataSourceRef, limit } = request;

      if (!dataSourceRef?.source) {
        return {
          status: "app_error",
          message: "No data source configuration provided",
        };
      }

      const config = JSON.parse(dataSourceRef.source) as DataSourceConfig;
      const token = getAuthToken();

      let dataTable: DataTable;

      switch (config.dataType) {
        case "agent": {
          if (!config.agentEmail) {
            return {
              status: "app_error",
              message: "Agent email is required",
            };
          }

          const agentData = await fetchAgentData(config.agentEmail, token || undefined);

          if (!agentData) {
            return {
              status: "app_error",
              message: "Failed to fetch agent data",
            };
          }

          dataTable = transformAgentToDataTable(agentData, config.selectedFields);
          break;
        }

        case "listing": {
          if (!config.listingId) {
            return {
              status: "app_error",
              message: "Listing ID is required",
            };
          }

          const listingData = await fetchListingData(config.listingId, token || undefined);

          if (!listingData) {
            return {
              status: "app_error",
              message: "Failed to fetch listing data",
            };
          }

          dataTable = transformListingToDataTable(listingData, config.selectedFields);
          break;
        }

        case "market-data": {
          if (!config.suburbPostcode) {
            return {
              status: "app_error",
              message: "Suburb/Postcode is required",
            };
          }

          const marketData = await fetchMarketData(config.suburbPostcode, token || undefined);

          if (!marketData) {
            return {
              status: "app_error",
              message: "Failed to fetch market data",
            };
          }

          dataTable = transformMarketDataToDataTable(marketData, config.selectedFields);
          break;
        }

        default:
          return {
            status: "app_error",
            message: `Unknown data type: ${config.dataType}`,
          };
      }

      // Ensure we don't exceed row limit
      if (limit?.row) {
        dataTable.rows = dataTable.rows.slice(0, limit.row);
      }

      return {
        status: "completed",
        dataTable,
        metadata: {
          description: getDataDescription(config),
          providerInfo: { name: "Agency Data" },
        },
      };
    } catch (error) {
      console.error("Error in getDataTable:", error);
      return {
        status: "app_error",
        message: error instanceof Error ? error.message : "Failed to process data request",
      };
    }
  },

  /**
   * Renders a UI component for selecting and configuring data from external sources.
   */
  renderSelectionUi: async (request: RenderSelectionUiRequest) => {
    root.render(
      <AppUiProvider>
        <SelectionUI {...request} />
      </AppUiProvider>
    );
  },
});

/**
 * Get a description for the data being provided
 */
function getDataDescription(config: DataSourceConfig): string {
  switch (config.dataType) {
    case "agent":
      return `Agent profile data for ${config.agentEmail}`;
    case "listing":
      return `Property listing data for ${config.listingId}`;
    case "market-data":
      return `Market statistics for ${config.suburbPostcode}`;
    default:
      return "Agency data";
  }
}

// Fallback message if data connector intent is not enabled
root.render(
  <AppUiProvider>
    <Alert tone="critical">
      If you&apos;re seeing this, you need to turn on the Data Connector intent in
      the developer portal for this app.
    </Alert>
  </AppUiProvider>
);
