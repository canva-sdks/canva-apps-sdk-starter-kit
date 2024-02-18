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
import { initAppElement, FontWeight, TextAttributes } from "@canva/design";
import React from "react";
import styles from "styles/components.css";

type AppElementData = {
  text: string;
  color: string;
  fontWeight: FontWeight;
  fontStyle: TextAttributes["fontStyle"];
  decoration: TextAttributes["decoration"];
  textAlign: TextAttributes["textAlign"];
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
            <Select<TextAttributes["fontStyle"]>
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
                { value: "thin", label: "Thin" },
                { value: "extralight", label: "Extra light" },
                { value: "light", label: "Light" },
                { value: "medium", label: "Medium" },
                { value: "semibold", label: "Semibold" },
                { value: "bold", label: "Bold" },
                { value: "heavy", label: "Heavy" },
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
            <Select<TextAttributes["decoration"]>
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
            <Select<TextAttributes["textAlign"]>
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
