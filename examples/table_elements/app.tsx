import { useState, useCallback } from "react";
import * as styles from "styles/components.css";
import {
  Alert,
  Button,
  ColorSelector,
  Column,
  Columns,
  FormField,
  NumberInput,
  PlusIcon,
  Rows,
  Text,
  TextInput,
  Title,
} from "@canva/app-ui-kit";
import type { CellState, TableState } from "./use_table_hook";
import { useTable } from "./use_table_hook";
import { useAddElement } from "utils/use_add_element";

const initialState: TableState = {
  rowCount: 4,
  columnCount: 5,
  cells: [
    {
      rowPos: 1,
      columnPos: 1,
      colSpan: 3,
      rowSpan: 2,
      text: "2x3",
      fillColor: "#deffdb",
    },
    {
      rowPos: 1,
      columnPos: 4,
      rowSpan: 2,
      text: "2x1",
      fillColor: "#dbf1ff",
    },
    { rowPos: 4, columnPos: 1, colSpan: 2, text: "1x2" },
    { rowPos: 3, columnPos: 5, fillColor: "#ffa000" },
  ],
};

const CellElement = ({
  index,
  value: state,
  onChange,
}: {
  index: number;
  value: CellState;
  onChange: (value: CellState) => void;
}) => {
  return (
    <Rows spacing="1u">
      <Title size="small">Cell #{index}</Title>
      <Columns spacing="1u">
        <Column width="1/2">
          <FormField
            label="Row position"
            value={state.rowPos}
            control={(props) => (
              <NumberInput
                {...props}
                onChange={(value) => {
                  onChange({ ...state, rowPos: value });
                }}
              />
            )}
          />
        </Column>
        <Column width="1/2">
          <FormField
            label="Column position"
            value={state.columnPos}
            control={(props) => (
              <NumberInput
                {...props}
                onChange={(value) => {
                  onChange({ ...state, columnPos: value });
                }}
              />
            )}
          />
        </Column>
      </Columns>
      <Columns spacing="1u">
        <Column width="1/2">
          <FormField
            label="rowSpan"
            value={state.rowSpan}
            control={(props) => (
              <NumberInput
                {...props}
                onChange={(value) => {
                  onChange({
                    ...state,
                    rowSpan: value,
                  });
                }}
              />
            )}
          />
        </Column>
        <Column width="1/2">
          <FormField
            label="colSpan"
            value={state.colSpan}
            control={(props) => (
              <NumberInput
                {...props}
                onChange={(value) => {
                  onChange({
                    ...state,
                    colSpan: value,
                  });
                }}
              />
            )}
          />
        </Column>
      </Columns>
      <Columns spacing="1u">
        <Column width="content">
          <FormField
            label="Text content"
            value={state.text}
            control={(props) => (
              <TextInput
                {...props}
                onChange={(value) => {
                  onChange({
                    ...state,
                    text: value,
                  });
                }}
              />
            )}
          />
        </Column>
        <Column width="content">
          <FormField
            label="Fill color"
            control={(props) => (
              <ColorSelector
                {...props}
                color={state.fillColor || "#FFFFFF"}
                onChange={(value) => {
                  onChange({
                    ...state,
                    fillColor: value === "#FFFFFF" ? undefined : value,
                  });
                }}
              />
            )}
          />
        </Column>
      </Columns>
    </Rows>
  );
};

export const App = () => {
  const tableState = useTable(initialState);
  const [submissionError, setSubmissionError] = useState("");
  const addElement = useAddElement();

  const onClick = useCallback(async () => {
    try {
      await addElement(tableState.toElement());
    } catch (e) {
      if (e instanceof Error) {
        setSubmissionError(e.message);
      }
    }
  }, [tableState]);

  const onAddCell = useCallback(() => {
    tableState.cells = [...(tableState.cells || []), {}];
  }, []);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
          This example demonstrates how apps can add table elements to a design.
        </Text>
        {(tableState.error || submissionError) && (
          <Alert tone="critical">{tableState.error || submissionError}</Alert>
        )}
        <Columns spacing="3u">
          <Column width="1/2">
            <FormField
              label="Total rows"
              value={tableState.rowCount}
              control={(props) => (
                <NumberInput
                  {...props}
                  onChange={(value) => {
                    tableState.rowCount = value;
                  }}
                />
              )}
            />
          </Column>
          <Column width="1/2">
            <FormField
              label="Total columns"
              value={tableState.columnCount}
              control={(props) => (
                <NumberInput
                  {...props}
                  onChange={(value) => {
                    tableState.columnCount = value;
                  }}
                />
              )}
            />
          </Column>
        </Columns>
        <Title size="medium">Cell customizations</Title>
        {tableState.cells?.map((value, index) => (
          <CellElement
            key={`cell-${index}`}
            index={index}
            value={value}
            onChange={(value) => {
              const cells = tableState.cells?.slice() || [];
              cells[index] = value;
              tableState.cells = cells;
            }}
          />
        ))}
        <Button variant="secondary" onClick={onAddCell} icon={PlusIcon}>
          New custom cell
        </Button>
        <Button variant="primary" onClick={onClick} stretch>
          Add element
        </Button>
      </Rows>
    </div>
  );
};
