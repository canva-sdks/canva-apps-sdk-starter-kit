import { FormField, Rows, Select, Text } from "@canva/app-ui-kit";
import { addNativeElement } from "@canva/design";
import { DraggableText } from "components/draggable_text";
import React from "react";
import styles from "styles/components.css";

type TextAlign = "start" | "center" | "end";
type FontWeight = "normal" | "bold";
type FontStyle = "normal" | "italic";
type Decoration = "none" | "underline";

type DraggableTextProperties = {
  textAlign?: TextAlign;
  fontWeight?: FontWeight;
  fontStyle?: FontStyle;
  decoration?: Decoration;
};

const content = "Drag me!";

export const App = () => {
  const [{ fontStyle, fontWeight, decoration, textAlign }, setState] =
    React.useState<Required<DraggableTextProperties>>({
      decoration: "none",
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "start",
    });
  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="4u">
        <Text>
          This example demonstrates how apps can support drag-and-drop of text.
        </Text>
        <Rows spacing="1.5u">
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
          <DraggableText
            style={{
              textAlign,
              textDecorationLine: decoration,
              fontStyle,
              fontWeight,
            }}
            onClick={() =>
              addNativeElement({
                type: "TEXT",
                textAlign,
                decoration,
                fontStyle,
                fontWeight,
                children: [content],
              })
            }
          >
            <Text variant={fontWeight === "bold" ? "bold" : "regular"}>
              {content}
            </Text>
          </DraggableText>
        </Rows>
      </Rows>
    </div>
  );
};
