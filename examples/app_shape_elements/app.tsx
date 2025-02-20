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

type AppElementData = {
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
  width: number;
  height: number;
  rotation: number;
};

type AppElementChangeEvent = {
  data: AppElementData;
  update?: (opts: AppElementOptions<AppElementData>) => Promise<void>;
};

const initialState: AppElementChangeEvent = {
  data: {
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
    width: 100,
    height: 100,
    rotation: 0,
  },
};

const appElementClient = initAppElement<AppElementData>({
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
          app elements. This makes the element re-editable and lets apps control
          additional properties, such as the width and height.
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
                      color={paths[outerIndex].fill.color}
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
                state.update({ data: state.data });
              } else {
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
