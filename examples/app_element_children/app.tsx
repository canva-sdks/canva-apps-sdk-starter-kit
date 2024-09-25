import {
  Button,
  FormField,
  NumberInput,
  Rows,
  Text,
  Title,
} from "@canva/app-ui-kit";
import type {
  AppElementRendererOutput,
  ShapeElementAtPoint,
} from "@canva/design";
import { initAppElement } from "@canva/design";
import { useEffect, useState } from "react";
import * as styles from "styles/components.css";

// The data that will be attached to the app element
type AppElementData = {
  rows: number;
  columns: number;
  width: number;
  height: number;
  spacing: number;
  rotation: number;
};

// The state of the user interface. In this example, this is the same
// as AppElementData, but it *could* be different.
type UIState = AppElementData;

// The default values for the UI components.
const initialState: UIState = {
  rows: 3,
  columns: 3,
  width: 100,
  height: 100,
  spacing: 25,
  rotation: 0,
};

const appElementClient = initAppElement<AppElementData>({
  // This callback runs when the app sets the element's data. It receives
  // the data and must respond with an array of elements.
  render: (data) => {
    const elements: AppElementRendererOutput = [];

    // For each row and column, create a shape element. The positions of the
    // elements are offset to ensure that none of them overlap.
    for (let row = 0; row < data.rows; row++) {
      for (let column = 0; column < data.columns; column++) {
        const { width, height, spacing, rotation } = data;
        const top = row * (height + spacing);
        const left = column * (width + spacing);
        const element = createSquareShapeElement({
          width,
          height,
          top,
          left,
          rotation,
        });
        elements.push(element);
      }
    }
    return elements;
  },
});

export const App = () => {
  const [state, setState] = useState<UIState>(initialState);
  const { width, height, rows, columns, spacing, rotation } = state;
  const disabled = width < 1 || height < 1 || rows < 1 || columns < 1;

  // This callback runs when the app element's data is modified or when the
  // user selects an app element. In both situations, we can use this callback
  // to update the state of the UI to reflect the latest data.
  useEffect(() => {
    appElementClient.registerOnElementChange((appElement) => {
      setState(appElement ? appElement.data : initialState);
    });
  }, []);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how app elements can be made up of one or
          more elements, and how those elements can be positioned relatively to
          one another.
        </Text>
        <Title size="small">Grid</Title>
        <FormField
          label="Rows"
          value={rows}
          control={(props) => (
            <NumberInput
              {...props}
              min={1}
              onChange={(value) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    rows: Number(value || 0),
                  };
                });
              }}
            />
          )}
        />
        <FormField
          label="Columns"
          value={columns}
          control={(props) => (
            <NumberInput
              {...props}
              min={1}
              onChange={(value) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    columns: Number(value || 0),
                  };
                });
              }}
            />
          )}
        />
        <FormField
          label="Spacing"
          value={spacing}
          control={(props) => (
            <NumberInput
              {...props}
              min={1}
              onChange={(value) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    spacing: Number(value || 0),
                  };
                });
              }}
            />
          )}
        />
        <Title size="small">Squares</Title>
        <FormField
          label="Width"
          value={width}
          control={(props) => (
            <NumberInput
              {...props}
              min={1}
              onChange={(value) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    width: Number(value || 0),
                  };
                });
              }}
            />
          )}
        />
        <FormField
          label="Height"
          value={height}
          control={(props) => (
            <NumberInput
              {...props}
              min={1}
              onChange={(value) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    height: Number(value || 0),
                  };
                });
              }}
            />
          )}
        />
        <FormField
          label="Rotation"
          value={rotation}
          control={(props) => (
            <NumberInput
              {...props}
              min={-180}
              max={180}
              onChange={(value) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    rotation: Number(value || 0),
                  };
                });
              }}
            />
          )}
        />
        <Button
          variant="primary"
          stretch
          onClick={() => {
            // This method attaches the provided data to the app element,
            // triggering the `registerRenderAppElement` callback.
            appElementClient.addOrUpdateElement(state);
          }}
          disabled={disabled}
        >
          Add or update element
        </Button>
      </Rows>
    </div>
  );
};

const createSquareShapeElement = ({
  width,
  height,
  top,
  left,
  rotation,
}: {
  width: number;
  height: number;
  top: number;
  left: number;
  rotation: number;
}): ShapeElementAtPoint => {
  return {
    type: "shape",
    paths: [
      {
        d: `M 0 0 H ${width} V ${height} H 0 L 0 0`,
        fill: {
          dropTarget: false,
          color: "#ff0099",
        },
      },
    ],
    viewBox: {
      width,
      height,
      top: 0,
      left: 0,
    },
    width,
    height,
    rotation,
    top,
    left,
  };
};
