import type { Cell, TableElement } from "@canva/design";

const MAX_CELL_COUNT = 225;

// Additional information in the wrapper that are not available in the table cell element.
// Currently, only merged cells, but it can later extend to other custom properties, like border, size,...
type MetaCell = {
  // If a cell is merged into another cell, then this field should tell that other cell.
  mergedInto?: { row: number; column: number };
};

export class TableWrapper {
  // A shadow of the cell array, that highlight the relationship between merged cells.
  private readonly metaCells: MetaCell[][];

  private constructor(
    private readonly rows: {
      cells: (Cell | null | undefined)[];
    }[],
  ) {
    this.validateRowColumn();
    this.metaCells = Array.from({ length: this.rows.length }, () =>
      Array.from({ length: this.rows[0].cells.length }, () => ({})),
    );
    this.syncMergedCellsFromRows();
  }

  /**
   * Creates an empty table wrapper.
   * @param rowCount - The number of rows to create the table with.
   * @param columnCount - The number of columns to create the table with.
   */
  static create(rowCount: number, columnCount: number) {
    const rows = Array.from({ length: rowCount }, () => ({
      cells: Array.from({ length: columnCount }, () => null),
    }));
    return new TableWrapper(rows);
  }

  /**
   * Converts a table element into a table wrapper.
   * @param element - The table element to convert into a table wrapper.
   * @throws TableValidationError if element is not a valid {@link TableElement}.
   */
  static fromElement(element: TableElement) {
    if (element.type !== "table") {
      throw new TableValidationError(
        `Cannot convert element of type ${element.type} to a table wrapper.`,
      );
    }
    if (!Array.isArray(element.rows)) {
      throw new TableValidationError(
        `Invalid table element: expected an array of rows, got ${element.rows}`,
      );
    }
    const rows = element.rows.map((row) => ({
      cells: row.cells.map(
        (cell) =>
          cell && {
            ...cell,
            attributes: cell.attributes ? { ...cell.attributes } : undefined,
          },
      ),
    }));
    return new TableWrapper(rows);
  }

  /**
   * Return a table element that can be passed into the `addElementAtPoint` or `addElementAtCursor` method.
   * @returns A table element.
   */
  toElement(): TableElement {
    return {
      type: "table",
      rows: this.rows,
    };
  }

  /**
   * Adds a row to the table after the specified row.
   * @param afterRowPos The position of the new row. A value of `0` adds a row before the first row, a
   * value of `1` adds a row after the first row, etc.
   * @remarks
   * If the row above and below the new row both have the same properties, the properties will be
   * copied to the new row. For example, if there are two rows with the same background color and a
   * row is inserted between them, the new row will also have the same background color.
   */
  addRow(afterRowPos: number) {
    if (afterRowPos < 0 || afterRowPos > this.rows.length) {
      throw new TableValidationError(
        `New row position must be between 0 and ${this.rows.length}.`,
      );
    }

    this.validateRowColumn(1, 0);

    const newRow = {
      cells: Array.from(
        { length: this.rows[0].cells.length },
        () => ({}) as Cell,
      ),
    };
    this.rows.splice(afterRowPos, 0, newRow);

    const newMergeCells: MetaCell[] = Array.from(
      { length: this.rows[0].cells.length },
      () => ({}),
    );
    this.metaCells.splice(afterRowPos, 0, newMergeCells);

    if (0 < afterRowPos && afterRowPos < this.rows.length) {
      // Insert in between rows
      for (let i = 0; i < newRow.cells.length; i++) {
        this.mayCopyStyles({
          frontRowIdx: afterRowPos - 1,
          frontColumnIdx: i,
          currentRowIdx: afterRowPos,
          currentColumnIdx: i,
          behindRowIdx: afterRowPos + 1,
          behindColumnIdx: i,
        });
      }
      this.syncCellSpansFromMetaCells();
    }
  }

  /**
   * Adds a column to the table after the specified column.
   * @param afterColumnPos The position of the new column. A value of `0` adds a column before the first
   * column, a value of `1` adds a column after the first column, etc.
   * @remarks
   * If the column before and after the new column both have the same properties, the properties will be
   * copied to the new column. For example, if there are two columns with the same background color and a
   * column is inserted between them, the new column will also have the same background color.
   */
  addColumn(afterColumnPos: number) {
    if (afterColumnPos < 0 || afterColumnPos > this.rows[0].cells.length) {
      throw new TableValidationError(
        `New column position must be between 0 and ${this.rows[0].cells.length}.`,
      );
    }

    this.validateRowColumn(0, 1);

    this.rows.forEach((row) => row.cells.splice(afterColumnPos, 0, null));

    const newMergeCell: MetaCell = {};
    this.metaCells.forEach((row) =>
      row.splice(afterColumnPos, 0, newMergeCell),
    );

    if (0 < afterColumnPos && afterColumnPos < this.rows[0].cells.length) {
      // Insert in between columns
      for (let i = 0; i < this.rows.length; i++) {
        this.mayCopyStyles({
          frontRowIdx: i,
          frontColumnIdx: afterColumnPos - 1,
          currentRowIdx: i,
          currentColumnIdx: afterColumnPos,
          behindRowIdx: i,
          behindColumnIdx: afterColumnPos + 1,
        });
      }
      this.syncCellSpansFromMetaCells();
    }
  }

  /**
   * Checks if the specified cell is a *ghost cell*.
   * @param rowPos The row number of the cell, starting from `1`.
   * @param columnPos The column number of the cell, starting from `1`.
   * @remarks
   * A ghost cell is a cell that can not be interacted as it is hidden by a row or column spanning
   * cell. For example, imagine a row where the first cell has a `colSpan` of `2`. In this case, the
   * second cell in the row is hidden and is therefore a ghost cell.
   */
  isGhostCell(rowPos: number, columnPos: number): boolean {
    this.validateCellBoundaries(rowPos, columnPos);
    const rowIndex = rowPos - 1;
    const columnIndex = columnPos - 1;
    const { mergedInto } = this.metaCells[rowIndex][columnIndex];
    if (!mergedInto) {
      // Not belongs to any merged cell
      return false;
    }
    // Not a ghost cell if it's merged into itself
    return mergedInto.row !== rowIndex || mergedInto.column !== columnIndex;
  }

  /**
   * Returns information about the specified cell.
   * @param rowPos The row number of the cell, starting from `1`.
   * @param columnPos The column number of the cell, starting from `1`.
   * @throws TableValidationError if the cell is a ghost cell. To learn more, see {@link isGhostCell}.
   */
  getCellDetails(rowPos: number, columnPos: number) {
    if (this.isGhostCell(rowPos, columnPos)) {
      throw new TableValidationError(
        `The cell at ${rowPos},${columnPos} is squashed into another cell`,
      );
    }
    return this.rows[rowPos - 1].cells[columnPos - 1];
  }

  /**
   * Sets the details of the specified cell, including its content and appearance.
   * @param rowPos The row number of the cell, starting from `1`.
   * @param columnPos The column number of the cell, starting from `1`.
   * @param details The new details for the cell.
   * @throws TableValidationError if the cell is a ghost cell. To learn more, see {@link isGhostCell}.
   */
  setCellDetails(rowPos: number, columnPos: number, details: Cell) {
    const rowSpan = details.rowSpan ?? 1;
    const colSpan = details.colSpan ?? 1;
    this.validateCellBoundaries(rowPos, columnPos, rowSpan, colSpan);
    if (this.isGhostCell(rowPos, columnPos)) {
      throw new TableValidationError(
        `The cell at ${rowPos},${columnPos} is squashed into another cell`,
      );
    }

    const rowIndex = rowPos - 1;
    const columnIndex = columnPos - 1;
    const { rowSpan: oldRowSpan, colSpan: oldColSpan } =
      this.rows[rowIndex].cells[columnIndex] || {};
    this.rows[rowIndex].cells[columnIndex] = details;

    if (oldRowSpan !== rowSpan || oldColSpan !== colSpan) {
      this.syncMergedCellsFromRows();
    }
  }

  private validateRowColumn(toBeAddedRow = 0, toBeAddedColumn = 0) {
    const rowCount = this.rows.length + toBeAddedRow;
    const columnCount = this.rows[0].cells.length + toBeAddedColumn;
    if (rowCount === 0) {
      throw new TableValidationError("Table must have at least one row.");
    }
    if (columnCount === 0) {
      throw new TableValidationError("Table must have at least one column.");
    }
    for (const row of this.rows) {
      if (row.cells.length + toBeAddedColumn !== columnCount) {
        throw new TableValidationError(
          "All rows must have the same number of columns.",
        );
      }
    }
    const cellCount = rowCount * columnCount;
    if (cellCount > MAX_CELL_COUNT) {
      throw new TableValidationError(
        `Table cannot have more than ${MAX_CELL_COUNT} cells. Actual: ${rowCount}x${columnCount} = ${cellCount}`,
      );
    }
  }

  /**
   * Read all cell's colSpans and rowSpans and update the merged cells accordingly.
   * This is opposite sync of {@link syncCellSpansFromMetaCells}.
   */
  private syncMergedCellsFromRows(): void {
    // First, reset metaCells to unmerged state
    this.metaCells.forEach((cells) =>
      cells.forEach((c) => (c.mergedInto = undefined)),
    );

    // Then loop through this.rows to find any merged cells
    for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
      const row = this.rows[rowIndex];
      for (let columnIndex = 0; columnIndex < row.cells.length; columnIndex++) {
        const cell = row.cells[columnIndex] || { colSpan: 1, rowSpan: 1 };
        const colSpan = cell.colSpan || 1;
        const rowSpan = cell.rowSpan || 1;
        if (colSpan !== 1 || rowSpan !== 1) {
          this.validateCellBoundaries(
            rowIndex + 1,
            columnIndex + 1,
            rowSpan,
            colSpan,
          );
          this.setMergedCellsByBoundary(
            rowIndex,
            columnIndex,
            rowIndex + rowSpan - 1,
            columnIndex + colSpan - 1,
          );
        }
      }
    }
  }

  /**
   * Update mergeCells array in accordance with the span boundary
   * @param fromRow Top most row index
   * @param fromColumn Left most column index
   * @param toRow Bottom most row index
   * @param toColumn Right most column index
   */
  private setMergedCellsByBoundary(
    fromRow: number,
    fromColumn: number,
    toRow: number,
    toColumn: number,
  ) {
    for (let row = fromRow; row <= toRow; row++) {
      for (let column = fromColumn; column <= toColumn; column++) {
        const metaCell = this.metaCells[row][column];

        if (metaCell.mergedInto) {
          // This cell may be squashed by another merge cell
          const { row: originalRow, column: originalColumn } =
            metaCell.mergedInto;
          if (originalRow !== fromRow && originalColumn !== fromColumn) {
            // And the old origin cell is mismatched with the new origin,
            // this mean the current meta cell is merged into 2 different origin cells,
            // which is forbidden.
            throw new TableValidationError(
              `Expanding the cell at ${fromRow},${fromColumn} collides with another merged cell from ${originalRow},${originalColumn}`,
            );
          }
        }

        metaCell.mergedInto = {
          row: fromRow,
          column: fromColumn,
        };
      }
    }
  }

  private mayCopyStyles({
    frontRowIdx,
    frontColumnIdx,
    behindRowIdx,
    behindColumnIdx,
    currentRowIdx,
    currentColumnIdx,
  }: {
    frontRowIdx: number;
    frontColumnIdx: number;
    behindRowIdx: number;
    behindColumnIdx: number;
    currentRowIdx: number;
    currentColumnIdx: number;
  }) {
    // Continue span if both front and behind cells belong to a same merged cell
    const frontMergedCell =
      this.metaCells[frontRowIdx][frontColumnIdx].mergedInto;
    const behindMergedCell =
      this.metaCells[behindRowIdx][behindColumnIdx].mergedInto;
    if (
      frontMergedCell &&
      frontMergedCell.row === behindMergedCell?.row &&
      frontMergedCell.column === behindMergedCell?.column
    ) {
      this.metaCells[currentRowIdx][currentColumnIdx].mergedInto = {
        ...frontMergedCell,
      };
    }

    // Copy attributes if both front and behind cells are the same
    const frontCell = this.rows[frontRowIdx].cells[frontColumnIdx];
    const behindCell = this.rows[behindRowIdx].cells[behindColumnIdx];
    if (
      frontCell != null &&
      behindCell != null &&
      frontCell.attributes &&
      behindCell.attributes
    ) {
      let currentCell = this.rows[currentRowIdx].cells[currentColumnIdx];
      for (const key of Object.keys(frontCell.attributes)) {
        if (frontCell.attributes[key] === behindCell.attributes[key]) {
          currentCell = currentCell || { type: "empty" };
          currentCell.attributes = currentCell.attributes || {};
          currentCell.attributes[key] = frontCell.attributes[key];
        }
      }
      this.rows[currentRowIdx].cells[currentColumnIdx] = currentCell;
    }
  }

  /**
   * Loop through meta cells and update rowSpan and colSpan of each cell accordingly.
   * This is opposite sync of {@link syncMergedCellsFromRows}
   */
  private syncCellSpansFromMetaCells() {
    const groups = new Map<string, { row: number; column: number }[]>();
    for (let row = 0; row < this.metaCells.length; row++) {
      for (let column = 0; column < this.metaCells[row].length; column++) {
        // Reset all rowSpans and colSpans
        const currentCell = this.rows[row].cells[column];
        currentCell && delete currentCell.rowSpan;
        currentCell && delete currentCell.colSpan;

        const mergedCell = this.metaCells[row][column];
        if (!mergedCell.mergedInto) {
          continue;
        }

        const { row: actualRow, column: actualColumn } = mergedCell.mergedInto;
        const key = `${actualRow},${actualColumn}`;
        if (!groups.has(key)) {
          groups.set(key, []);
        }
        groups.get(key)?.push({ row, column });
      }
    }

    groups.forEach((cells, key) => {
      const { minRow, maxRow, minColumn, maxColumn } = cells.reduce(
        (prev, { row, column }) => {
          return {
            minRow: Math.min(prev.minRow, row),
            maxRow: Math.max(prev.maxRow, row),
            minColumn: Math.min(prev.minColumn, column),
            maxColumn: Math.max(prev.maxColumn, column),
          };
        },
        { minRow: Infinity, maxRow: -1, minColumn: Infinity, maxColumn: -1 },
      );
      if (
        !isFinite(minRow) ||
        !isFinite(minColumn) ||
        maxRow < 0 ||
        maxColumn < 0
      ) {
        throw new TableValidationError(`Invalid merged cell started at ${key}`);
      }
      const rowSpan = maxRow - minRow + 1;
      const columnSpan = maxColumn - minColumn + 1;
      if (rowSpan > 1 || columnSpan > 1) {
        const currentCell = this.rows[minRow].cells[minColumn] || {
          type: "empty",
        };
        currentCell.rowSpan = rowSpan;
        currentCell.colSpan = columnSpan;
        this.rows[minRow].cells[minColumn] = currentCell;
      }
    });
  }

  private validateCellBoundaries(
    rowPos: number,
    columnPos: number,
    rowSpan = 1,
    columnSpan = 1,
  ) {
    if (rowPos < 1 || rowPos > this.rows.length) {
      throw new TableValidationError(
        `Row position must be between 1 and ${this.rows.length} (number of rows).`,
      );
    }
    if (columnPos < 1 || columnPos > this.rows[0].cells.length) {
      throw new TableValidationError(
        `Column position must be between 1 and ${this.rows[0].cells.length} (number of columns).`,
      );
    }
    if (rowSpan < 1) {
      throw new TableValidationError(`Row span must be greater than 0.`);
    }
    if (columnSpan < 1) {
      throw new TableValidationError(`Column span must be greater than 0.`);
    }
    if (rowPos + rowSpan - 1 > this.rows.length) {
      throw new TableValidationError(
        `Cannot expand ${rowSpan} rows from the cell at ${rowPos},${columnPos}. Table has ${this.rows.length} rows.`,
      );
    }
    if (columnPos + columnSpan - 1 > this.rows[0].cells.length) {
      throw new TableValidationError(
        `Cannot expand ${columnSpan} columns from the cell at ${rowPos},${columnPos}. Table has ${this.rows[0].cells.length} columns.`,
      );
    }
  }
}

class TableValidationError extends Error {}
