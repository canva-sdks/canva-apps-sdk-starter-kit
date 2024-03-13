import { Rows, Text, Title, tokens } from "@canva/app-ui-kit";
import type { DataTable, DataTableColumn } from "@canva/preview/data";
import { onSelectDataTable } from "@canva/preview/data";
import React from "react";
import styles from "styles/components.css";

const breedsDataTable: DataTable = {
  name: "Dog breeds",
  columns: [
    {
      type: "string",
      name: "name",
      values: [
        "Golden retriever",
        "Labrador retriever",
        "Flat-coated retriever",
        "Goldendoodle",
      ],
    },
    {
      type: "string",
      name: "country",
      values: ["Scotland", "United Kingdom", "England", "Australia"],
    },
    { type: "number", name: "weight", values: [35, 35, 30, 25] },
    {
      type: "boolean",
      name: "isPureBreed",
      values: [true, true, true, false],
    },
  ],
};

// The number of rows is the length of the longest column
const numRows = breedsDataTable.columns.sort(
  (a, b) => b.values.length - a.values.length
)[0].values.length;

// An app that uses the Data SDK to return a single data table to a consumer (e.g. Bulk Create)
export const App = () => {
  React.useEffect(() => {
    // This callback runs when Bulk Create wants to receive data
    onSelectDataTable(async (opts) => {
      // This callback returns the single data table to Bulk Create
      opts.selectDataTable(breedsDataTable);
    });
  }, []);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          Here's a preview of the data this app provides. To use this data:
        </Text>
        <ul>
          <li>
            <Text>
              Mark your app as a data provider via the toggle in the developer
              portal.
            </Text>
          </li>
          <li>
            <Text>
              Go to "Bulk Create" via the "Apps" tab in the Side Panel.
            </Text>
          </li>
          <li>
            <Text>Select "More data sources".</Text>
          </li>
          <li>
            <Text>Select this app.</Text>
          </li>
        </ul>
        <Title size="small" alignment="center">
          Dog Breeds data table
        </Title>
        <table>
          <thead>
            <tr>
              {breedsDataTable.columns.map(({ name }, idx) => (
                <th
                  key={idx}
                  style={{ textAlign: "left", padding: tokens.space1 }}
                >
                  <Text>{formatColumnName(name)}</Text>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(numRows).keys()].map((r, idx) => (
              <tr key={idx}>
                {breedsDataTable.columns.map((column, idx) => (
                  <td
                    key={idx}
                    style={{
                      padding: tokens.space1,
                      textAlign: column.type === "boolean" ? "center" : "start",
                    }}
                  >
                    <Text>{formatColumn(column)[r]}</Text>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Rows>
    </div>
  );
};

function formatColumnName(name: string) {
  switch (name) {
    case "name":
      return "Name";
    case "country":
      return "Country of origin";
    case "isPureBreed":
      return "Pure breed?";
    case "weight":
      return "Weight (kg)";
    default:
      return name;
  }
}

function formatColumn(column: DataTableColumn) {
  switch (column.type) {
    case "boolean":
      return column.values.map((v) => (v ? "Y" : "N"));
    case "date":
      return column.values.map((v) => (v ? v.toDateString() : ""));
    case "number":
      return column.values.map((v) => (v ? v.toString() : ""));
    case "string":
      return column.values.map((v) => (v ? v : ""));
  }
}
