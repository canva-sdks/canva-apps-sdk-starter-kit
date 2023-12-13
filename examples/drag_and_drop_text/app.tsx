import {
  FormField,
  Rows,
  Select,
  Text,
  TypographyCard,
} from "@canva/app-ui-kit";
import { addNativeElement, ui } from "@canva/design";
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

const content = "Add a little bit of body text";

export const App = () => {
  const [{ fontStyle, fontWeight, decoration, textAlign }, setState] =
    React.useState<Required<DraggableTextProperties>>({
      decoration: "none",
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "start",
    });

  const onDragStart = (event: React.DragEvent<HTMLElement>) => {
    ui.startDrag(event, {
      type: "TEXT",
      textAlign,
      decoration,
      fontStyle,
      fontWeight,
      children: [content],
    });
  };
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
          <TypographyCard
            ariaLabel="Add text to design"
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
            onDragStart={onDragStart}
          >
            <Text variant={fontWeight === "bold" ? "bold" : "regular"}>
              {content}
            </Text>
          </TypographyCard>
        </Rows>
      </Rows>
    </div>
  );
};
