import { TableWrapper } from "utils/table_wrapper";
import type { TableElement } from "@canva/design";
import { useCallback, useEffect, useState } from "react";

/**
 * The current state of a cell within a table.
 */
export type CellState = {
  /**
   * The position of the cell in the row, starting from `1`.
   */
  rowPos?: number;
  /**
   * The position of the cell in the column, starting from `1`.
   */
  columnPos?: number;
  /**
   * The number of rows that the cell should span.
   */
  rowSpan?: number;
  /**
   * The number of columns that the cell should span.
   */
  colSpan?: number;
  /**
   * The text content of the cell.
   */
  text?: string;
  /**
   * The background color of the cell as a hex code. The hex code be six characters long
   * and preceded with a `#`. For example, `#ff0099`.
   */
  fillColor?: string;
};

/**
 * The current state of a table.
 */
export type TableState = {
  /**
   * The number of rows in the table.
   */
  rowCount?: number;
  /**
   * The number of columns in the table.
   */
  columnCount?: number;
  /**
   * By default, a table's cells are empty. You can use this property to define the
   * content and appearance of cells.
   */
  cells?: CellState[];
  /**
   * An error message to indicate that the table is in an error state.
   */
  error?: string;
};

/**
 * A hook that simplifies the creation of a table and the management of a table's state.
 * @param initialState The initial state of the table, such as the number of rows and columns it has.
 * @returns The current state of the table and methods for interacting with the table.
 */
export const useTable = (
  initialState: TableState,
): TableState & {
  /**
   * Converts the table state into a {@link TableElement}. The result can then
   * be passed into the `addElementAtPoint` or `addElementAtCursor` method.
   */
  toElement(): TableElement;
} => {
  const [rowCount, setRowCount] = useState(initialState.rowCount);
  const [columnCount, setColumnCount] = useState(initialState.columnCount);
  const [cells, setCells] = useState<CellState[]>(initialState.cells || []);
  const [error, setError] = useState<string | undefined>();
  const [wrapper, setWrapper] = useState<TableWrapper>(
    TableWrapper.create(rowCount || 1, columnCount || 1),
  );

  const toElement = useCallback(() => wrapper.toElement(), [wrapper]);

  useEffect(() => {
    setError(undefined);
    if (typeof rowCount !== "number" || typeof columnCount !== "number") {
      return;
    }

    try {
      const newWrapper = TableWrapper.create(rowCount, columnCount);
      setWrapper(newWrapper);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  }, [rowCount, columnCount]);

  useEffect(() => {
    setError(undefined);
    try {
      for (const cell of cells) {
        if (
          typeof cell.rowPos === "number" &&
          typeof cell.columnPos === "number"
        ) {
          wrapper.setCellDetails(cell.rowPos, cell.columnPos, {
            rowSpan: cell.rowSpan,
            colSpan: cell.colSpan,
            type: "string",
            value: cell.text || "",
            attributes: cell.fillColor
              ? { backgroundColor: cell.fillColor }
              : undefined,
          });
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  }, [cells, wrapper]);

  return {
    get rowCount() {
      return rowCount;
    },
    set rowCount(value) {
      setRowCount(value);
    },
    get columnCount() {
      return columnCount;
    },
    set columnCount(value) {
      setColumnCount(value);
    },
    get cells() {
      return cells;
    },
    set cells(value) {
      setCells(value);
    },
    get error() {
      return error;
    },
    toElement,
  };
};
