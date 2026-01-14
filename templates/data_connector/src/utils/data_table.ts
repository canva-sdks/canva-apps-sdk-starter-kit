import type {
  BooleanDataTableCell,
  ColumnConfig,
  DataTable,
  DataTableCell,
  DateDataTableCell,
  NumberDataTableCell,
  StringDataTableCell,
} from "@canva/intents/data";
import type { APIResponseItem } from "src/api";

export interface DataTableColumn<T extends APIResponseItem> {
  label: string;
  getValue: keyof T | ((result: T) => boolean | string | number | Date);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toCell: (value: any) => DataTableCell;
}

export function toDataTable<T extends APIResponseItem>(
  apiData: T[],
  columns: DataTableColumn<T>[],
  rowLimit: number,
): DataTable {
  const items = apiData.slice(0, rowLimit);
  const dataTable: DataTable = {
    columnConfigs: columnConfig(columns),
    rows: [],
  };
  items.forEach((item) => {
    const cells = columns.map((column) => {
      const value =
        typeof column.getValue === "function"
          ? column.getValue(item)
          : item[column.getValue];
      return column.toCell(value);
    });
    dataTable.rows.push({ cells });
  });
  return dataTable;
}

/**
 * Converts an array of DataTableColumn to ColumnConfig.
 * @param columns Array of DataTableColumn
 * @returns Array of ColumnConfig
 */
function columnConfig<T extends APIResponseItem>(
  columns: DataTableColumn<T>[],
): ColumnConfig[] {
  return columns.map((column) => ({
    name: column.label,
    type: column.toCell({} as unknown).type, // Use an empty object to infer the type
  }));
}

/**
 * Creates a string cell for the data table.
 * @param value  String containing up to 10,000 characters
 */
export function stringCell(value: string): StringDataTableCell {
  return {
    type: "string",
    value,
  };
}

/**
 * Creates a number cell for the data table.
 * @param value Number within range `Number.MIN_SAFE_INTEGER` and `Number.MAX_SAFE_INTEGER`
 * @param formatting Formatting using ISO/IEC 29500-1:2016 Office Open XML Format
 */
export function numberCell(
  value: number,
  formatting?: string,
): NumberDataTableCell {
  return {
    type: "number",
    value,
    metadata: {
      formatting,
    },
  };
}

/**
 * Creates a boolean cell for the data table.
 * @param value Boolean value
 */
export function booleanCell(value: boolean): BooleanDataTableCell {
  return {
    type: "boolean",
    value,
  };
}

/**
 * Creates a date cell for the data table.
 * @param value Number, Date or String
 * @description If value is a string, it will be parsed as a date. If value is a number, it will be treated as a timestamp in seconds.
 */
export function dateCell(value: number | Date | string): DateDataTableCell {
  // if string, parse as date
  if (typeof value === "string") {
    value = new Date(value);
  }

  // if is date, convert to timestamp in seconds
  if (value instanceof Date) {
    value = value.valueOf() / 1000;
  }

  return {
    type: "date",
    value,
  };
}
