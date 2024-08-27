import { TableWrapper } from "../table_wrapper";
import type { NativeTableElement } from "@canva/design";

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
      const element: NativeTableElement = {
        type: "TABLE",
        rows: [
          {
            cells: [{ colSpan: 2 }, {}, { rowSpan: 2 }],
          },
          {
            cells: [
              {
                text: { type: "TEXT", children: ["hello"] },
              },
              {
                fill: { color: "#ff00ff" },
              },
              {},
            ],
          },
        ],
      };
      const wrapper = TableWrapper.fromElement(element);
      expect(wrapper.toElement()).toEqual(element);

      // Make sure the new element is not a reference
      if (element.rows[1].cells[0].text) {
        element.rows[1].cells[0].text.color = "#ff0000";
      }
      expect(wrapper.toElement()).not.toEqual(element);
    });
    it("should throw an error if the element is not a table", () => {
      const element = {
        type: "TEXT",
        children: ["hello"],
      };
      expect(() => {
        TableWrapper.fromElement(element as unknown as NativeTableElement);
      }).toThrow();
    });
    it("should throw an error if the element has no rows", () => {
      expect(() => {
        TableWrapper.fromElement({
          type: "TABLE",
        } as unknown as NativeTableElement);
      }).toThrow();
      expect(() => {
        TableWrapper.fromElement({
          type: "TABLE",
          rows: [],
        });
      }).toThrow();
    });
    it("should throw an error if any row of the element has no cells", () => {
      const element: NativeTableElement = {
        type: "TABLE",
        rows: [{ cells: [] }],
      };
      expect(() => {
        TableWrapper.fromElement(element);
      }).toThrow();
    });
    it("should throw an error if number of cells is inconsistent", () => {
      const element: NativeTableElement = {
        type: "TABLE",
        rows: [{ cells: [{}, {}] }, { cells: [{}] }],
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
      wrapper.setCellDetails(1, 1, { fill: { color: "#ff0000" } });
      wrapper.setCellDetails(2, 1, { fill: { color: "#ff0000" } });
      wrapper.addRow(1);
      const newCell = wrapper.getCellDetails(2, 1);
      expect(newCell.fill).toBeDefined();
      expect(newCell.fill?.color).toBe("#ff0000");
    });
    it("should expand the row span if top and bottom cells belong to the same merged cell", () => {
      const wrapper = TableWrapper.create(2, 3);
      wrapper.setCellDetails(1, 1, { rowSpan: 2 });
      wrapper.addRow(1);
      const mergedCell = wrapper.getCellDetails(1, 1);
      expect(mergedCell.rowSpan).toBe(3);
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
      wrapper.setCellDetails(1, 1, { fill: { color: "#ff0000" } });
      wrapper.setCellDetails(1, 2, { fill: { color: "#ff0000" } });
      wrapper.addColumn(1);
      const newCell = wrapper.getCellDetails(1, 2);
      expect(newCell.fill).toBeDefined();
      expect(newCell.fill?.color).toBe("#ff0000");
    });
    it("should expand the column span if left and right cells belong to the same merged cell", () => {
      const wrapper = TableWrapper.create(2, 3);
      wrapper.setCellDetails(1, 1, { colSpan: 2 });
      wrapper.addColumn(1);
      const mergedCell = wrapper.getCellDetails(1, 1);
      expect(mergedCell.colSpan).toBe(3);
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
      wrapper.setCellDetails(1, 1, { colSpan: 2 });
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
        text: { type: "TEXT", children: ["hello"] },
        fill: { color: "#ff0000" },
      });
      expect(wrapper.isGhostCell(1, 1)).toBe(false);
      expect(wrapper.isGhostCell(1, 2)).toBe(true);
      expect(wrapper.isGhostCell(2, 1)).toBe(true);
      expect(wrapper.isGhostCell(2, 2)).toBe(true);
      const element = wrapper.toElement();
      expect(element.rows[0].cells[0].text).toBeDefined();
      expect(element.rows[0].cells[0].text?.children[0]).toBe("hello");
      expect(element.rows[0].cells[0].fill).toBeDefined();
      expect(element.rows[0].cells[0].fill?.color).toBe("#ff0000");
    });
    it("should throw an error if the position is out of bounds", () => {
      const wrapper = TableWrapper.create(2, 3);
      expect(() => wrapper.setCellDetails(0, 1, {})).toThrow();
      expect(() => wrapper.setCellDetails(3, 1, {})).toThrow();
      expect(() => wrapper.setCellDetails(1, 0, {})).toThrow();
      expect(() => wrapper.setCellDetails(1, 4, {})).toThrow();
    });
    it("should throw an error if the rowSpan is invalid", () => {
      const wrapper = TableWrapper.create(2, 3);
      expect(() => wrapper.setCellDetails(1, 1, { rowSpan: -1 })).toThrow();
      expect(() => wrapper.setCellDetails(1, 1, { rowSpan: 0 })).toThrow();
      expect(() => wrapper.setCellDetails(1, 1, { rowSpan: 3 })).toThrow();
    });
    it("should throw an error if the colSpan is invalid", () => {
      const wrapper = TableWrapper.create(2, 3);
      expect(() => wrapper.setCellDetails(1, 1, { colSpan: -1 })).toThrow();
      expect(() => wrapper.setCellDetails(1, 1, { colSpan: 0 })).toThrow();
      expect(() => wrapper.setCellDetails(1, 1, { colSpan: 4 })).toThrow();
    });
  });
});
