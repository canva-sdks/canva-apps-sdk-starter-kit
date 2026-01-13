import type {
  GetDataTableRequest,
  GetDataTableResponse,
} from "@canva/intents/data";
import {
  appError,
  completeDataTable,
  outdatedSourceRef,
  remoteRequestFailed,
} from "src/utils/fetch_result";
import { DATA_SOURCES } from "./data_sources";
import { DataAPIError } from ".";

/**
 * This function handles parsing the data fetch parameters and calling the appropriate handler for the data source.
 * @param request
 * @param authToken
 * @returns
 */
export const buildDataTableResult = async (
  request: GetDataTableRequest,
  authToken?: string,
): Promise<GetDataTableResponse> => {
  const source = JSON.parse(request.dataSourceRef.source);
  const rowLimit = request.limit.row - 1; // -1 for the header row

  const dataHandler = DATA_SOURCES.find((handler) =>
    handler.matchSource(source),
  );
  if (!dataHandler) {
    // the configured source does not match the expected data source type
    // return an error result which will prompt the user to reconfigure the data source
    return outdatedSourceRef();
  }
  try {
    const dataTable = await dataHandler.fetchAndBuildTable(
      source,
      authToken || "",
      rowLimit,
      request.signal,
    );
    if (dataTable.rows.length === 0) {
      // if the data table is empty, return an error to prompt the user to reconfigure the data source
      return appError("No results found.");
    }
    return completeDataTable(dataTable);
  } catch (error) {
    if (error instanceof DataAPIError) {
      return remoteRequestFailed();
    }
    return appError(
      error instanceof Error ? error.message : "An unknown error occurred",
    );
  }
};
