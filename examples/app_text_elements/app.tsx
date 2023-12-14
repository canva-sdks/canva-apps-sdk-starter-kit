import {
  Button,
  ColorSelector,
  FormField,
  NumberInput,
  RadioGroup,
  Rows,
  Select,
  Text,
  TextInput,
  Title,
} from "@canva/app-ui-kit";
import { initAppElement } from "@canva/design";
import React from "react";
import styles from "styles/components.css";

type FontWeight = "normal" | "bold";
type FontStyle = "normal" | "italic";
type Decoration = "none" | "underline";
type TextAlign = "start" | "center" | "end";

type AppElementData = {
  text: string;
  color: string;
  fontWeight: FontWeight;
  fontStyle: FontStyle;
  decoration: Decoration;
  textAlign: TextAlign;
  width: number;
  rotation: number;
  useCustomWidth: boolean;
};

type UIState = AppElementData;

const initialState: UIState = {
  text: "Hello world",
  color: "#ff0099",
  fontWeight: "normal",
  fontStyle: "normal",
  decoration: "none",
  textAlign: "start",
  width: 250,
  rotation: 0,
  useCustomWidth: false,
};

const appElementClient = initAppElement<AppElementData>({
  render: (data) => {
    return [
      {
        type: "TEXT",
        top: 0,
        left: 0,
        ...data,
        width: data.useCustomWidth ? data.width : undefined,
        children: [data.text],
      },
    ];
  },
});

export const App = () => {
  const [state, setState] = React.useState<UIState>(initialState);

  const {
    text,
    color,
    fontWeight,
    fontStyle,
    decoration,
    textAlign,
    width,
    rotation,
    useCustomWidth,
  } = state;

  const disabled = text.trim().length < 1 || color.trim().length < 1;

  React.useEffect(() => {
    appElementClient.registerOnElementChange((appElement) => {
      setState(appElement ? appElement.data : initialState);
    });
  }, []);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can create text elements inside app
          elements. This makes the element re-editable and lets apps control
          additional properties, such as the width and height.
        </Text>
        <FormField
          label="Text"
          value={text}
          control={(props) => (
            <TextInput
              {...props}
              onChange={(value) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    text: value,
                  };
                });
              }}
            />
          )}
        />
        <Title size="small">Custom options</Title>
        <FormField
          label="Color"
          control={() => (
            <ColorSelector
              color={color}
              onChange={(value) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    color: value,
                  };
                });
              }}
            />
          )}
        />
        <FormField
          label="Font style"
          value={fontStyle}
          control={(props) => (
            <Select<FontStyle>
              {...props}
              options={[
                { value: "normal", label: "Normal" },
                { value: "italic", label: "Italic" },
              ]}
              onChange={(value) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    fontStyle: value,
                  };
                });
              }}
              stretch
            />
          )}
        />
        <FormField
          label="Font weight"
          value={fontWeight}
          control={(props) => (
            <Select<FontWeight>
              {...props}
              options={[
                { value: "normal", label: "Normal" },
                { value: "bold", label: "Bold" },
              ]}
              onChange={(value) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    fontWeight: value,
                  };
                });
              }}
              stretch
            />
          )}
        />
        <FormField
          label="Decoration"
          value={decoration}
          control={(props) => (
            <Select<Decoration>
              {...props}
              options={[
                { value: "none", label: "None" },
                { value: "underline", label: "Underline" },
              ]}
              onChange={(value) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    decoration: value,
                  };
                });
              }}
              stretch
            />
          )}
        />
        <FormField
          label="Text align"
          value={textAlign}
          control={(props) => (
            <Select<TextAlign>
              {...props}
              options={[
                { value: "start", label: "Start" },
                { value: "center", label: "Center" },
                { value: "end", label: "End" },
              ]}
              onChange={(value) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    textAlign: value,
                  };
                });
              }}
              stretch
            />
          )}
        />
        <FormField
          label="Width"
          value={useCustomWidth}
          control={(props) => (
            <RadioGroup
              {...props}
              options={[
                {
                  label: "Fit to content",
                  value: false,
                },
                {
                  label: "Use custom width",
                  value: true,
                },
              ]}
              onChange={(value) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    useCustomWidth: value,
                  };
                });
              }}
            />
          )}
        />
        {useCustomWidth ? (
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
                      width: Number(value || 1),
                    };
                  });
                }}
              />
            )}
          />
        ) : undefined}
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
          onClick={() => {
            appElementClient.addOrUpdateElement(state);
          }}
          disabled={disabled}
          stretch
        >
          Add or update text
        </Button>
      </Rows>
    </div>
  );
};
