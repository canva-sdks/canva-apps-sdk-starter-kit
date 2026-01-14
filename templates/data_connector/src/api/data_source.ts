import type { DataTable } from "@canva/intents/data";
import type { JSX } from "react";
import { type DataTableColumn, toDataTable } from "src/utils";

/**
 * This file defines types and classes related to data source configuration, fetching and outputting as a data table.
 * When data is loaded, the app will save the data source config so that it can be queried again later to refresh the data.
 * Strongly typed data sources are simple to reload and validate.
 */

/**
 * The data source configuration represents all parameters that are needed to represent the data source so that it can be queried again later.
 * This includes the schema, any filters that are applied to the data source, and any other parameters that are needed to fetch the data.
 */
export interface DataSourceConfig {
  // a unique identifier for the data source that is used to associated the saved data source config with the data source handler
  schema: string;
}

/**
 * the API response item is a generic type that represents the data returned from the API
 */
export interface APIResponseItem {
  id: string;
}

export class DataAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * The data source handler class defines a particular data source and how to fetch data from it.
 * In this template, the two data sources are brand templates and designs. Each data source has its own handler.
 * The handler defines the schema for the data source configuration (what filters are applied to get the requested data), the columns to display, and how to fetch data from the API.
 * It also defines the UI for how this source is represented on the data source selection page and how to render the data source configuration page where any filters can be set.
 */
export class DataSourceHandler<
  T extends DataSourceConfig,
  R extends APIResponseItem,
> {
  schema: string;
  constructor(
    // the configuration for this data source. The default values will be overridden by the user setting filters, or on app launch if the previous state is restored
    public sourceConfig: T,
    // the columns to display in the data table output. In this template they are fixed, but they could be dynamic based on the data source and configuration
    public columns: DataTableColumn<R>[],
    // the fetch logic for turning the data source configuration into an array of data items to turn into a data table
    public fetchData: (
      source: T,
      authToken: string,
      rowLimit: number,
      signal: AbortSignal | undefined,
    ) => Promise<R[]>,
    // the UI for the data source selection page. This is where the user chooses which data source to use.
    public selectionPage: () => JSX.Element,
    // the UI for the data source configuration page. This is where the user sets any filters or other parameters for the data source.
    public configPage: (sourceConfig: T) => JSX.Element,
  ) {
    this.schema = sourceConfig.schema;
  }

  /**
   * A type guard / type predicate to check if the data source configuration matches the schema of this data source handler.
   * @param source the data source configuration to match against
   * @returns
   */
  matchSource(source: DataSourceConfig): source is T {
    return source.schema === this.schema;
  }

  /**
   * The buildTable function is called to fetch data from the API and return it as a data table.
   * @param source the data source configuration
   * @param authToken the auth token to use for the API request
   * @param rowLimit the maximum number of rows to return
   * @param signal an optional abort signal to cancel the request
   * @returns a data table with the data from the API
   */
  async fetchAndBuildTable(
    source: T,
    authToken: string,
    rowLimit: number,
    signal: AbortSignal | undefined,
  ): Promise<DataTable> {
    let apiData: R[];
    try {
      apiData = await this.fetchData(source, authToken || "", rowLimit, signal);
    } catch {
      throw new DataAPIError("Failed to fetch data from API");
    }
    // the toDataTable utility takes the API data and the configured columns and turns it into a data table
    return toDataTable(apiData, this.columns, rowLimit);
  }
}
