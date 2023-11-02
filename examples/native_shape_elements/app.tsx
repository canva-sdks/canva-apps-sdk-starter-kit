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
import { addNativeElement } from "@canva/design";
import React from "react";
import styles from "styles/components.css";

type UIState = {
  paths: {
    d: string;
    fill: {
      dropTarget: boolean;
      color: string;
    };
  }[];
  viewBox: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
};

const initialState: UIState = {
  paths: [
    {
      d: "M 0 0 H 100 V 100 H 0 L 0 0",
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
};

export const App = () => {
  const [state, setState] = React.useState<UIState>(initialState);

  const { paths, viewBox } = state;
  const disabled = paths.length < 1;

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Rows spacing="3u">
          <Text>
            This example demonstrates how apps can add native shape elements to
            a design.
          </Text>
          <Rows spacing="1u">
            <Columns spacing="0" alignY="center">
              <Column>
                <Title size="small">Paths</Title>
              </Column>
              <Column width="content">
                {paths.length < 7 && (
                  <button
                    onClick={() => {
                      setState((prevState) => {
                        return {
                          ...prevState,
                          paths: [
                            ...prevState.paths,
                            {
                              d: "",
                              fill: {
                                dropTarget: false,
                                color: "#000000",
                              },
                            },
                          ],
                        };
                      });
                    }}
                    style={{
                      appearance: "none",
                      border: "none",
                      backgroundColor: "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <PlusIcon />
                  </button>
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
                              paths: prevState.paths.map((path, innerIndex) => {
                                if (outerIndex === innerIndex) {
                                  return {
                                    ...path,
                                    d: value,
                                  };
                                }
                                return path;
                              }),
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
                        color={paths[outerIndex].fill.color}
                        onChange={(value) => {
                          setState((prevState) => {
                            return {
                              ...prevState,
                              paths: prevState.paths.map((path, innerIndex) => {
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
                              }),
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
                      viewBox: {
                        ...prevState.viewBox,
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
            value={viewBox.height}
            control={(props) => (
              <NumberInput
                {...props}
                min={1}
                onChange={(value) => {
                  setState((prevState) => {
                    return {
                      ...prevState,
                      viewBox: {
                        ...prevState.viewBox,
                        height: Number(value || 0),
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
                      viewBox: {
                        ...prevState.viewBox,
                        top: Number(value || 0),
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
                      viewBox: {
                        ...prevState.viewBox,
                        left: Number(value || 0),
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
              addNativeElement({
                type: "SHAPE",
                paths,
                viewBox,
              });
            }}
            disabled={disabled}
            stretch
          >
            Add element
          </Button>
        </Rows>
      </Rows>
    </div>
  );
};
