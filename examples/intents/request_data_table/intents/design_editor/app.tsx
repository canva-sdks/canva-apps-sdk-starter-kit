// For usage information, see the README.md file.
import { Alert, Button, Rows, Text, Title } from "@canva/app-ui-kit";
import type { DataTable } from "@canva/intents/data";
import { requestDataTable } from "@canva/intents/data";
import { useState } from "react";
import * as styles from "styles/components.css";

export function App() {
  const [dataTable, setDataTable] = useState<DataTable | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetDataTable = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Opens the selection UI for this app's own Data Connector (see
      // intents/data_connector/index.tsx) and resolves with the DataTable the
      // user loads there.
      const table = await requestDataTable({
        withDataConnector: "self",
        dataSelectionDisplay: "show",
      });
      setDataTable(table);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Title>Request data table</Title>
        <Text>
          Calls requestDataTable to open this app's own Data Connector and fetch
          the table the user loads.
        </Text>
        <Button
          variant="primary"
          onClick={handleGetDataTable}
          loading={isLoading}
          stretch
        >
          Get data
        </Button>
        {error && <Alert tone="critical">{error}</Alert>}
        {dataTable && <DataTablePreview dataTable={dataTable} />}
      </Rows>
    </div>
  );
}

function DataTablePreview({ dataTable }: { dataTable: DataTable }) {
  const columnNames = dataTable.columnConfigs?.map((c) => c.name ?? "") ?? [];

  return (
    <Rows spacing="1u">
      <Text size="small" tone="secondary">
        {dataTable.rows.length} row{dataTable.rows.length !== 1 ? "s" : ""}{" "}
        returned
      </Text>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          {columnNames.length > 0 && (
            <thead>
              <tr>
                {columnNames.map((name, i) => (
                  <th
                    key={i}
                    style={{
                      textAlign: "left",
                      padding: "4px 8px",
                      borderBottom: "1px solid var(--ui-kit-border-standard)",
                    }}
                  >
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {dataTable.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    style={{
                      padding: "4px 8px",
                      borderBottom: "1px solid var(--ui-kit-border-standard)",
                    }}
                  >
                    {cell.type === "string" ? (cell.value ?? "") : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Rows>
  );
}
