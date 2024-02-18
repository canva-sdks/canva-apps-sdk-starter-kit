import {
  Button,
  ColorSelector,
  FormField,
  Rows,
  Select,
  Text,
  TextInput,
  Title,
} from "@canva/app-ui-kit";
import { addNativeElement, FontWeight, TextAttributes } from "@canva/design";
import React from "react";
import styles from "styles/components.css";

type UIState = {
  text: string;
  color: string;
  fontWeight: FontWeight;
  fontStyle: TextAttributes["fontStyle"];
  decoration: TextAttributes["decoration"];
  textAlign: TextAttributes["textAlign"];
};

const initialState: UIState = {
  text: "Hello world",
  color: "#ff0099",
  fontWeight: "normal",
  fontStyle: "normal",
  decoration: "none",
  textAlign: "start",
};

export const App = () => {
  const [state, setState] = React.useState<UIState>(initialState);

  const { text, color, fontWeight, fontStyle, decoration, textAlign } = state;
  const disabled = text.trim().length < 1 || color.trim().length < 1;

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can create text elements as native
          elements.
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
              stretch
              onChange={(style) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    fontStyle: style,
                  };
                });
              }}
              options={[
                { value: "normal", label: "Normal" },
                { value: "italic", label: "Italic" },
              ]}
            />
          )}
        />
        <FormField
          label="Font weight"
          value={fontWeight}
          control={(props) => (
            <Select<FontWeight>
              {...props}
              stretch
              onChange={(fontWeight) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    fontWeight: fontWeight,
                  };
                });
              }}
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
            />
          )}
        />
        <FormField
          label="Decoration"
          value={decoration}
          control={(props) => (
            <Select<TextAttributes["decoration"]>
              {...props}
              stretch
              onChange={(decoration) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    decoration: decoration,
                  };
                });
              }}
              options={[
                { value: "none", label: "None" },
                { value: "underline", label: "Underline" },
              ]}
            />
          )}
        />
        <FormField
          label="Text align"
          value={textAlign}
          control={(props) => (
            <Select<TextAttributes["textAlign"]>
              {...props}
              stretch
              onChange={(textAlign) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    textAlign: textAlign,
                  };
                });
              }}
              options={[
                { value: "start", label: "Start" },
                { value: "center", label: "Center" },
                { value: "end", label: "End" },
              ]}
            />
          )}
        />
        <Button
          variant="primary"
          onClick={() => {
            addNativeElement({
              type: "TEXT",
              ...state,
              children: [state.text],
            });
          }}
          disabled={disabled}
          stretch
        >
          Add element
        </Button>
      </Rows>
    </div>
  );
};
