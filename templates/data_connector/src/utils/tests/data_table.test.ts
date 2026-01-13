/* eslint-disable formatjs/no-literal-string-in-object */
import type { APIResponseItem } from "src/api";
import {
  booleanCell,
  dateCell,
  numberCell,
  stringCell,
  toDataTable,
} from "../data_table";
import type { DataTableColumn } from "../data_table";

describe("data table utils", () => {
  interface TestItem extends APIResponseItem {
    id: string;
    name: string;
    count: number;
    active: boolean;
    createdAt: string;
  }

  const testItems: TestItem[] = [
    {
      id: "item1",
      name: "Test Item 1",
      count: 42,
      active: true,
      createdAt: "2023-01-01T00:00:00Z",
    },
    {
      id: "item2",
      name: "Test Item 2",
      count: 0,
      active: false,
      createdAt: "2023-02-15T12:30:45Z",
    },
  ];

  const columns: DataTableColumn<TestItem>[] = [
    {
      label: "ID",
      getValue: "id",
      toCell: stringCell,
    },
    {
      label: "Name",
      getValue: "name",
      toCell: stringCell,
    },
    {
      label: "Count",
      getValue: "count",
      toCell: numberCell,
    },
    {
      label: "Status",
      getValue: "active",
      toCell: booleanCell,
    },
    {
      label: "Created",
      getValue: "createdAt",
      toCell: dateCell,
    },
    {
      label: "Custom",
      getValue: (item) => `${item.name} (${item.count})`,
      toCell: stringCell,
    },
  ];

  test("toDataTable creates correct structure", () => {
    const result = toDataTable(testItems, columns, 10);

    expect(result.rows.length).toBe(testItems.length);
    expect(result.columnConfigs?.map((cell) => cell.name)).toEqual([
      "ID",
      "Name",
      "Count",
      "Status",
      "Created",
      "Custom",
    ]);
  });

  test("toDataTable respects row limit", () => {
    const result = toDataTable(testItems, columns, 1);

    expect(result.rows.length).toBe(1);
  });

  test("toDataTable handles function-based getValue", () => {
    const result = toDataTable(testItems, columns, 10);

    // Check the custom column values
    expect(result.rows[0]?.cells[5]?.value).toBe("Test Item 1 (42)");
    expect(result.rows[1]?.cells[5]?.value).toBe("Test Item 2 (0)");
  });

  test("cell formatter functions create correct cell structures", () => {
    expect(stringCell("test")).toEqual({ type: "string", value: "test" });

    expect(numberCell(42)).toEqual({
      type: "number",
      value: 42,
      metadata: { formatting: undefined },
    });

    expect(numberCell(42, "#,##0")).toEqual({
      type: "number",
      value: 42,
      metadata: { formatting: "#,##0" },
    });

    expect(booleanCell(true)).toEqual({ type: "boolean", value: true });

    // Test date with string input
    const dateResult1 = dateCell("2023-01-01T00:00:00Z");
    expect(dateResult1.type).toBe("date");
    expect(typeof dateResult1.value).toBe("number");

    // Test date with Date object input
    const dateObj = new Date("2023-01-01T00:00:00Z");
    const dateResult2 = dateCell(dateObj);
    expect(dateResult2.type).toBe("date");
    expect(typeof dateResult2.value).toBe("number");

    // Test date with timestamp input
    const timestamp = dateObj.valueOf() / 1000; // seconds
    const dateResult3 = dateCell(timestamp);
    expect(dateResult3.type).toBe("date");
    expect(dateResult3.value).toBe(timestamp);
  });
});
