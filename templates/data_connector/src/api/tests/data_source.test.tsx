/* eslint-disable formatjs/no-literal-string-in-object */
/* eslint-disable formatjs/no-literal-string-in-jsx */
import { toDataTable } from "src/utils";
import type { APIResponseItem, DataSourceConfig } from "../data_source";
import { DataAPIError, DataSourceHandler } from "../data_source";

// Mock dependencies
jest.mock("src/utils", () => ({
  toDataTable: jest.fn().mockReturnValue({ rows: [] }),
}));

describe("DataSourceHandler", () => {
  // Test interface
  interface TestConfig extends DataSourceConfig {
    testField: string;
  }

  interface TestResponse extends APIResponseItem {
    name: string;
  }

  // Test data
  const mockConfig: TestConfig = {
    schema: "test/v1",
    testField: "value",
  };

  const mockColumns = [
    {
      label: "ID",
      getValue: (item: TestResponse) => `ID ${item.id}`,
      toCell: jest.fn().mockReturnValue({ type: "string", value: "id-123" }),
    },
    {
      label: "Name",
      getValue: "name" as const,
      toCell: jest.fn().mockReturnValue({ type: "string", value: "Test Name" }),
    },
  ];

  const mockFetchData = jest.fn();
  const mockSelectionPage = jest.fn().mockReturnValue(<div>Selection</div>);
  const mockConfigPage = jest.fn().mockReturnValue(<div>Config</div>);

  let handler: DataSourceHandler<TestConfig, TestResponse>;

  beforeEach(() => {
    jest.clearAllMocks();
    handler = new DataSourceHandler<TestConfig, TestResponse>(
      mockConfig,
      mockColumns,
      mockFetchData,
      mockSelectionPage,
      mockConfigPage,
    );
  });

  test("creates handler with correct schema", () => {
    expect(handler.schema).toBe("test/v1");
    expect(handler.sourceConfig).toEqual(mockConfig);
  });

  test("matchSource returns true for matching schema", () => {
    const result = handler.matchSource({ schema: "test/v1" });
    expect(result).toBe(true);
  });

  test("matchSource returns false for non-matching schema", () => {
    const result = handler.matchSource({ schema: "wrong/v1" });
    expect(result).toBe(false);
  });

  test("fetchAndBuildTable calls fetchData with correct parameters", async () => {
    const mockData = [{ id: "id-123", name: "Test Item" }];
    mockFetchData.mockResolvedValueOnce(mockData);

    const authToken = "test-token";
    const rowLimit = 10;
    const signal = new AbortController().signal;

    await handler.fetchAndBuildTable(mockConfig, authToken, rowLimit, signal);

    expect(mockFetchData).toHaveBeenCalledWith(
      mockConfig,
      authToken,
      rowLimit,
      signal,
    );
    expect(toDataTable).toHaveBeenCalledWith(mockData, mockColumns, rowLimit);
  });

  test("fetchAndBuildTable throws DataAPIError when fetchData fails", async () => {
    mockFetchData.mockRejectedValueOnce(new Error("Network error"));

    await expect(
      handler.fetchAndBuildTable(mockConfig, "token", 10, undefined),
    ).rejects.toThrow(DataAPIError);
  });
});
