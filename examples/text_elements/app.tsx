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
import type { FontWeight, TextAttributes } from "@canva/design";
import { useCallback, useState } from "react";
import * as styles from "styles/components.css";
import { useAddElement } from "utils/use_add_element";

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
  const [state, setState] = useState<UIState>(initialState);
  const addElement = useAddElement();

  const { text, color, fontWeight, fontStyle, decoration, textAlign } = state;
  const disabled = text.trim().length < 1 || color.trim().length < 1;

  const addText = useCallback(async () => {
    await addElement({
      type: "text",
      ...state,
      children: [state.text],
    });
  }, [state, addElement]);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can add text elements to design.
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
                    fontWeight,
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
                    decoration,
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
                    textAlign,
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
        <Button variant="primary" onClick={addText} disabled={disabled} stretch>
          Add element
        </Button>
      </Rows>
    </div>
  );
};
