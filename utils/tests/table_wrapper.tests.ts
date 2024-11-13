import { TableWrapper } from "../table_wrapper";
import type { Cell, TableElement } from "@canva/design";

describe("TableWrapper", () => {
  describe("create", () => {
    it("should create a new table", () => {
      const wrapper = TableWrapper.create(2, 3);
      const element = wrapper.toElement();
      expect(element.rows.length).toBe(2);
      expect(element.rows[0].cells.length).toBe(3);
      expect(element.rows[1].cells.length).toBe(3);
    });
    it("should throw an error if the row count is less than 1", () => {
      expect(() => TableWrapper.create(0, 1)).toThrow();
    });
    it("should throw an error if the column count is less than 1", () => {
      expect(() => TableWrapper.create(1, 0)).toThrow();
    });
    it("should throw an error if the number of cells exceeds 225", () => {
      expect(() => TableWrapper.create(16, 15)).toThrow();
    });
  });

  describe("fromElement", () => {
    it("should create a table wrapper from an existing table element", () => {
      const element: TableElement = {
        type: "table",
        rows: [
          {
            cells: [
              { colSpan: 2, type: "empty" },
              { type: "empty" },
              { rowSpan: 2, type: "empty" },
            ],
          },
          {
            cells: [
              {
                type: "string",
                value: "hello",
              },
              {
                type: "empty",
                attributes: { backgroundColor: "#ff00ff" },
              },
              { type: "empty" },
            ],
          },
        ],
      };
      const wrapper = TableWrapper.fromElement(element);
      expect(wrapper.toElement()).toEqual(element);

      // Make sure the new element is not a reference
      if (element.rows[1].cells[1]?.attributes) {
        element.rows[1].cells[1].attributes.backgroundColor = "#ff0000";
      }
      expect(wrapper.toElement()).not.toEqual(element);
    });
    it("should throw an error if the element is not a table", () => {
      const element = {
        type: "TEXT",
        children: ["hello"],
      };
      expect(() => {
        TableWrapper.fromElement(element as unknown as TableElement);
      }).toThrow();
    });
    it("should throw an error if the element has no rows", () => {
      expect(() => {
        TableWrapper.fromElement({
          type: "TABLE",
        } as unknown as TableElement);
      }).toThrow();
      expect(() => {
        TableWrapper.fromElement({
          type: "table",
          rows: [],
        });
      }).toThrow();
    });
    it("should throw an error if any row of the element has no cells", () => {
      const element: TableElement = {
        type: "table",
        rows: [{ cells: [] }],
      };
      expect(() => {
        TableWrapper.fromElement(element);
      }).toThrow();
    });
    it("should throw an error if number of cells is inconsistent", () => {
      const element: TableElement = {
        type: "table",
        rows: [
          { cells: [{ type: "empty" }, { type: "empty" }] },
          { cells: [{ type: "empty" }] },
        ],
      };
      expect(() => {
        TableWrapper.fromElement(element);
      }).toThrow();
    });
  });

  describe("addRow", () => {
    it("should add a row to the table", () => {
      const wrapper = TableWrapper.create(2, 3);
      wrapper.addRow(0);
      const element = wrapper.toElement();
      expect(element.rows.length).toBe(3);
      expect(element.rows[0].cells.length).toBe(3);
    });
    it("should copy the fill value if top and bottom cells are the same", () => {
      const wrapper = TableWrapper.create(2, 3);
      wrapper.setCellDetails(1, 1, {
        type: "empty",
        attributes: { backgroundColor: "#ff0000" },
      });
      wrapper.setCellDetails(2, 1, {
        type: "empty",
        attributes: { backgroundColor: "#ff0000" },
      });
      wrapper.addRow(1);
      const newCell = wrapper.getCellDetails(2, 1);
      expect(newCell?.attributes).toBeDefined();
      expect(newCell?.attributes?.backgroundColor).toBe("#ff0000");
    });
    it("should expand the row span if top and bottom cells belong to the same merged cell", () => {
      const wrapper = TableWrapper.create(2, 3);
      wrapper.setCellDetails(1, 1, { rowSpan: 2, type: "empty" });
      wrapper.addRow(1);
      const mergedCell = wrapper.getCellDetails(1, 1);
      expect(mergedCell?.rowSpan).toBe(3);
    });
    it("should throw an error if the row position is out of bounds", () => {
      const wrapper = TableWrapper.create(2, 3);
      expect(() => wrapper.addRow(-1)).toThrow();
      expect(() => wrapper.addRow(3)).toThrow();
    });
  });

  describe("addColumn", () => {
    it("should add a column to the table", () => {
      const wrapper = TableWrapper.create(2, 3);
      wrapper.addColumn(0);
      const element = wrapper.toElement();
      expect(element.rows.length).toBe(2);
      expect(element.rows[0].cells.length).toBe(4);
    });
    it("should copy the fill value if left and right cells are the same", () => {
      const wrapper = TableWrapper.create(2, 3);
      wrapper.setCellDetails(1, 1, {
        type: "empty",
        attributes: { backgroundColor: "#ff0000" },
      });
      wrapper.setCellDetails(1, 2, {
        type: "empty",
        attributes: { backgroundColor: "#ff0000" },
      });
      wrapper.addColumn(1);
      const newCell = wrapper.getCellDetails(1, 2);
      expect(newCell?.attributes).toBeDefined();
      expect(newCell?.attributes?.backgroundColor).toBe("#ff0000");
    });
    it("should expand the column span if left and right cells belong to the same merged cell", () => {
      const wrapper = TableWrapper.create(2, 3);
      wrapper.setCellDetails(1, 1, { type: "empty", colSpan: 2 });
      wrapper.addColumn(1);
      const mergedCell = wrapper.getCellDetails(1, 1);
      expect(mergedCell?.colSpan).toBe(3);
    });
    it("should throw an error if the column position is out of bounds", () => {
      const wrapper = TableWrapper.create(2, 3);
      expect(() => wrapper.addColumn(-1)).toThrow();
      expect(() => wrapper.addColumn(4)).toThrow();
    });
  });

  describe("isGhostCell", () => {
    it("should return true if the cell is a ghost cell", () => {
      const wrapper = TableWrapper.create(2, 3);
      wrapper.setCellDetails(1, 1, { type: "empty", colSpan: 2 });
      expect(wrapper.isGhostCell(1, 1)).toBe(false);
      expect(wrapper.isGhostCell(1, 2)).toBe(true);
      expect(wrapper.isGhostCell(1, 3)).toBe(false);
    });
    it("should throw an error if the position is out of bounds", () => {
      const wrapper = TableWrapper.create(2, 3);
      expect(() => wrapper.isGhostCell(0, 1)).toThrow();
      expect(() => wrapper.isGhostCell(3, 1)).toThrow();
      expect(() => wrapper.isGhostCell(1, 0)).toThrow();
      expect(() => wrapper.isGhostCell(1, 4)).toThrow();
    });
  });

  describe("setCellDetails", () => {
    it("should set the cell details", () => {
      const wrapper = TableWrapper.create(2, 3);
      wrapper.setCellDetails(1, 1, {
        colSpan: 2,
        rowSpan: 2,
        type: "string",
        value: "hello",
        attributes: { backgroundColor: "#ff0000" },
      });
      expect(wrapper.isGhostCell(1, 1)).toBe(false);
      expect(wrapper.isGhostCell(1, 2)).toBe(true);
      expect(wrapper.isGhostCell(2, 1)).toBe(true);
      expect(wrapper.isGhostCell(2, 2)).toBe(true);
      const element = wrapper.toElement();
      const firstCell = element.rows[0].cells[0] as Cell & {
        type: "string";
        value: string;
      };
      expect(firstCell?.type).toBe("string");
      expect(firstCell.value).toBe("hello");
      expect(firstCell.attributes).toBeDefined();
      expect(firstCell.attributes?.backgroundColor).toBe("#ff0000");
    });
    it("should throw an error if the position is out of bounds", () => {
      const wrapper = TableWrapper.create(2, 3);
      expect(() => wrapper.setCellDetails(0, 1, { type: "empty" })).toThrow();
      expect(() => wrapper.setCellDetails(3, 1, { type: "empty" })).toThrow();
      expect(() => wrapper.setCellDetails(1, 0, { type: "empty" })).toThrow();
      expect(() => wrapper.setCellDetails(1, 4, { type: "empty" })).toThrow();
    });
    it("should throw an error if the rowSpan is invalid", () => {
      const wrapper = TableWrapper.create(2, 3);
      expect(() =>
        wrapper.setCellDetails(1, 1, { type: "empty", rowSpan: -1 }),
      ).toThrow();
      expect(() =>
        wrapper.setCellDetails(1, 1, { type: "empty", rowSpan: 0 }),
      ).toThrow();
      expect(() =>
        wrapper.setCellDetails(1, 1, { type: "empty", rowSpan: 3 }),
      ).toThrow();
    });
    it("should throw an error if the colSpan is invalid", () => {
      const wrapper = TableWrapper.create(2, 3);
      expect(() =>
        wrapper.setCellDetails(1, 1, { type: "empty", colSpan: -1 }),
      ).toThrow();
      expect(() =>
        wrapper.setCellDetails(1, 1, { type: "empty", colSpan: 0 }),
      ).toThrow();
      expect(() =>
        wrapper.setCellDetails(1, 1, { type: "empty", colSpan: 4 }),
      ).toThrow();
    });
  });
});
