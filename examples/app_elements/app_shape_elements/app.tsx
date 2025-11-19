// For usage information, see the README.md file.
import {
  Button,
  ColorSelector,
  Column,
  Columns,
  FormField,
  MultilineInput,
  NumberInput,
  PlusIcon,
  Rows,
  Text,
  Title,
} from "@canva/app-ui-kit";
import { type AppElementOptions, initAppElement } from "@canva/design";
import { useEffect, useState } from "react";
import * as styles from "styles/components.css";

// Data structure for shape elements within app elements
type AppElementData = {
  // Array of SVG path objects that define the shape geometry
  paths: {
    d: string; // SVG path data using standard path commands (M, L, H, V, C, etc.)
    fill: {
      dropTarget: boolean; // Whether this path accepts dropped content from Canva
      color: string; // Hex color value for the shape fill
    };
  }[];
  // SVG viewBox defines the coordinate system and visible area
  viewBox: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
  // Physical dimensions and rotation of the app element in Canva
  width: number;
  height: number;
  rotation: number;
};

// Event object received when an app element is selected or modified in Canva
type AppElementChangeEvent = {
  data: AppElementData;
  update?: (opts: AppElementOptions<AppElementData>) => Promise<void>; // Function to update existing app element
};

// Default state when no app element is selected - creates a simple square path
const initialState: AppElementChangeEvent = {
  data: {
    paths: [
      {
        d: "M 0 0 H 100 V 100 H 0 L 0 0", // SVG path for a 100x100 square
        fill: {
          dropTarget: false,
          color: "#ff0099",
        },
      },
    ],
    viewBox: {
      width: 100,
      height: 100,
      top: 0,
      left: 0,
    },
    width: 100,
    height: 100,
    rotation: 0,
  },
};

// Initialize the app element client to handle shape rendering in Canva
const appElementClient = initAppElement<AppElementData>({
  // Define how the app element data should be rendered as design elements
  render: (data) => {
    return [{ type: "shape", top: 0, left: 0, ...data }];
  },
});

export const App = () => {
  const [state, setState] = useState<AppElementChangeEvent>(initialState);
  const {
    data: { paths, viewBox, width, height, rotation },
  } = state;
  const disabled = paths.length < 1;

  useEffect(() => {
    // Register listener for when user selects an app element in Canva
    appElementClient.registerOnElementChange((appElement) => {
      setState(
        appElement
          ? {
              data: appElement.data,
              update: appElement.update,
            }
          : initialState,
      );
    });
  }, []);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
          This example demonstrates how apps can create shape elements inside
          app elements. Using an app element makes the shape element re-editable
          and lets apps control additional properties, such as the width and
          height.
        </Text>
        <Rows spacing="1u">
          <Columns spacing="0" alignY="center">
            <Column>
              <Title size="small">Paths</Title>
            </Column>
            <Column width="content">
              {paths.length < 7 && (
                <Button
                  variant="tertiary"
                  icon={PlusIcon}
                  ariaLabel="Add a new path"
                  onClick={() => {
                    setState((prevState) => {
                      return {
                        ...prevState,
                        data: {
                          ...prevState.data,
                          paths: [
                            ...prevState.data.paths,
                            {
                              d: "",
                              fill: {
                                dropTarget: false,
                                color: "#000000",
                              },
                            },
                          ],
                        },
                      };
                    });
                  }}
                />
              )}
            </Column>
          </Columns>
          {paths.map((path, outerIndex) => {
            return (
              <Rows spacing="2u" key={outerIndex}>
                <FormField
                  label="Line commands"
                  value={path.d}
                  control={(props) => (
                    <MultilineInput
                      {...props}
                      onChange={(value) => {
                        setState((prevState) => {
                          return {
                            ...prevState,
                            data: {
                              ...prevState.data,
                              paths: prevState.data.paths.map(
                                (path, innerIndex) => {
                                  if (outerIndex === innerIndex) {
                                    return {
                                      ...path,
                                      d: value,
                                    };
                                  }
                                  return path;
                                },
                              ),
                            },
                          };
                        });
                      }}
                    />
                  )}
                />
                <FormField
                  label="Color"
                  control={() => (
                    <ColorSelector
                      color={path.fill.color}
                      onChange={(value) => {
                        setState((prevState) => {
                          return {
                            ...prevState,
                            data: {
                              ...prevState.data,
                              paths: prevState.data.paths.map(
                                (path, innerIndex) => {
                                  if (outerIndex === innerIndex) {
                                    return {
                                      ...path,
                                      fill: {
                                        ...path.fill,
                                        color: value,
                                      },
                                    };
                                  }
                                  return path;
                                },
                              ),
                            },
                          };
                        });
                      }}
                    />
                  )}
                />
              </Rows>
            );
          })}
        </Rows>
        <Rows spacing="2u">
          <Title size="small">Viewbox</Title>
          <FormField
            label="Width"
            value={viewBox.width}
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
                        viewBox: {
                          ...prevState.data.viewBox,
                          width: Number(value || 0),
                        },
                      },
                    };
                  });
                }}
              />
            )}
          />
          <FormField
            label="Height"
            value={viewBox.height}
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
                        viewBox: {
                          ...prevState.data.viewBox,
                          height: Number(value || 0),
                        },
                      },
                    };
                  });
                }}
              />
            )}
          />
          <FormField
            label="Top"
            value={viewBox.top}
            control={(props) => (
              <NumberInput
                {...props}
                min={0}
                onChange={(value) => {
                  setState((prevState) => {
                    return {
                      ...prevState,
                      data: {
                        ...prevState.data,
                        viewBox: {
                          ...prevState.data.viewBox,
                          top: Number(value || 0),
                        },
                      },
                    };
                  });
                }}
              />
            )}
          />
          <FormField
            label="Left"
            value={viewBox.left}
            control={(props) => (
              <NumberInput
                {...props}
                min={0}
                onChange={(value) => {
                  setState((prevState) => {
                    return {
                      ...prevState,
                      data: {
                        ...prevState.data,
                        viewBox: {
                          ...prevState.data.viewBox,
                          left: Number(value || 0),
                        },
                      },
                    };
                  });
                }}
              />
            )}
          />
        </Rows>
        <Rows spacing="2u">
          <Title size="small">Position</Title>
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
        </Rows>
        <Rows spacing="1u">
          <Button
            variant="secondary"
            onClick={() => {
              setState(initialState);
            }}
            stretch
          >
            Reset
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (state.update) {
                // Update existing app element in Canva
                state.update({ data: state.data });
              } else {
                // Add new app element to Canva design
                appElementClient.addElement({ data: state.data });
              }
            }}
            disabled={disabled}
            stretch
          >
            {`${state.update ? "Update" : "Add"} shape`}
          </Button>
        </Rows>
      </Rows>
    </div>
  );
};
