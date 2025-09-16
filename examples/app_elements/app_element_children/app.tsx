// For usage information, see the README.md file.
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
  AppElementOptions,
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

// The state of the user interface. In this example,
// we have data representing AppElementData, but it *could* be different.
// We also store an update function that can be used to update the app element.
type AppElementChangeEvent = {
  data: AppElementData;
  update?: (opts: AppElementOptions<AppElementData>) => Promise<void>;
};

// The default values for the UI components.
const initialState: AppElementChangeEvent = {
  data: {
    rows: 3,
    columns: 3,
    width: 100,
    height: 100,
    spacing: 25,
    rotation: 0,
  },
};

// Initialize the app element client with custom render logic
// App elements are Canva design objects that can contain multiple child elements
const appElementClient = initAppElement<AppElementData>({
  // This render callback executes when Canva needs to display the app element
  // It transforms our app data into actual design elements positioned on the canvas
  render: (data) => {
    const elements: AppElementRendererOutput = [];

    // Generate a grid of shape elements based on rows and columns
    // Each shape is positioned using absolute coordinates relative to the app element
    for (let row = 0; row < data.rows; row++) {
      for (let column = 0; column < data.columns; column++) {
        const { width, height, spacing, rotation } = data;
        // Calculate position offsets to create a non-overlapping grid layout
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
  const [state, setState] = useState<AppElementChangeEvent>(initialState);
  const {
    data: { width, height, rows, columns, spacing, rotation },
  } = state;
  const disabled = width < 1 || height < 1 || rows < 1 || columns < 1;

  // Register a change listener to sync UI state with selected app elements
  // This is called when the user selects an app element in Canva or when element data changes
  useEffect(() => {
    appElementClient.registerOnElementChange((appElement) => {
      // Update local state to reflect the current app element's data
      // If no element is selected, reset to default values
      setState(
        appElement
          ? { data: appElement.data, update: appElement.update }
          : initialState,
      );
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
                    data: {
                      ...prevState.data,
                      rows: Number(value || 0),
                    },
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
                    data: {
                      ...prevState.data,
                      columns: Number(value || 0),
                    },
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
                    data: {
                      ...prevState.data,
                      spacing: Number(value || 0),
                    },
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
                    data: {
                      ...prevState.data,
                      width: Number(value || 0),
                    },
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
                    data: {
                      ...prevState.data,
                      height: Number(value || 0),
                    },
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
                    data: {
                      ...prevState.data,
                      rotation: Number(value || 0),
                    },
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
            // Add new app element or update existing one with current data
            // This triggers the render callback to create the visual elements on canvas
            if (state.update) {
              // Update existing app element with new data
              state.update({ data: state.data });
            } else {
              // Create new app element and add it to the design
              appElementClient.addElement({ data: state.data });
            }
          }}
          disabled={disabled}
        >
          {`${state.update ? "Update" : "Add"} element`}
        </Button>
      </Rows>
    </div>
  );
};

// Creates a square shape element using SVG path data
// Shape elements are one of the core design element types in Canva
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
    // SVG path defining a rectangle shape (Move to origin, Horizontal line, Vertical line, etc.)
    paths: [
      {
        d: `M 0 0 H ${width} V ${height} H 0 L 0 0`,
        fill: {
          dropTarget: false,
          color: "#ff0099", // Bright pink fill color
        },
      },
    ],
    // ViewBox defines the coordinate system for the shape
    viewBox: {
      width,
      height,
      top: 0,
      left: 0,
    },
    // Physical dimensions and positioning on the canvas
    width,
    height,
    rotation,
    top,
    left,
  };
};
