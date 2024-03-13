import { Button, Rows, Text } from "@canva/app-ui-kit";
import type { DataTable } from "@canva/preview/data";
import { onSelectDataTable } from "@canva/preview/data";
import React from "react";
import styles from "styles/components.css";

const properties = {
  sydney: {
    name: "Sydney",
    columns: [
      {
        type: "string",
        name: "address",
        values: ["110 Kippax Street", "105 Kippax Street", "5 Lacey Street"],
      },
      { type: "number", name: "price", values: [3000000, 1000000, 2000000] },
      {
        type: "date",
        name: "soldAt",
        values: [new Date(), new Date(), undefined],
      },
    ],
  },
  brisbane: {
    name: "Brisbane",
    columns: [
      {
        type: "string",
        name: "address",
        values: ["110 Kippax Street", "105 Kippax Street", "5 Lacey Street"],
      },
      { type: "number", name: "price", values: [3000000, 1000000, 2000000] },
      {
        type: "date",
        name: "soldAt",
        values: [new Date(), new Date(), undefined],
      },
    ],
  },
  melbourne: {
    name: "Melbourne",
    columns: [
      {
        type: "string",
        name: "address",
        values: ["110 Kippax Street", "105 Kippax Street", "5 Lacey Street"],
      },
      { type: "number", name: "price", values: [3000000, 1000000, 2000000] },
      {
        type: "date",
        name: "soldAt",
        values: [new Date(), new Date(), undefined],
      },
    ],
  },
};

type State = {
  selectDataTable?: (dataTable: DataTable) => void;
};

// An app that exposes multiple data tables, allows users to select a data
// table, and returns the selected data table to a consumer (e.g. Bulk Create)
export const App = () => {
  const [state, setState] = React.useState<State>({});

  React.useEffect(() => {
    // This callback runs when Bulk Create wants to receive data
    onSelectDataTable(async (opts) => {
      setState((prevState) => {
        return {
          ...prevState,
          ...opts,
        };
      });
    });
  }, []);

  if (!state.selectDataTable) {
    return (
      <div className={styles.scrollContainer}>
        <Rows spacing="2u">
          <Text>To use the data this app provides:</Text>
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
            <li>
              <Text>Select which city's data you'd like to consume.</Text>
            </li>
          </ul>
        </Rows>
      </div>
    );
  }

  // Displaying a UI, allowing users to select from a range of data tables
  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>Choose a location</Text>
        <Rows spacing="1u">
          {Object.entries(properties).map(([key, value]) => {
            return (
              <Button
                key={key}
                variant="secondary"
                onClick={() => {
                  if (!state?.selectDataTable) {
                    return;
                  }

                  const dataTable = properties[key];

                  state.selectDataTable(dataTable);
                }}
                stretch
              >
                {value.name}
              </Button>
            );
          })}
        </Rows>
      </Rows>
    </div>
  );
};
