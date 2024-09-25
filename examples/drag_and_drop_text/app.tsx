import {
  Alert,
  FormField,
  Rows,
  Select,
  Text,
  TypographyCard,
} from "@canva/app-ui-kit";
import type { FontWeight, TextAttributes } from "@canva/design";
import { ui } from "@canva/design";
import { useState } from "react";
import * as styles from "styles/components.css";
import { useAddElement } from "utils/use_add_element";
import { useFeatureSupport } from "utils/use_feature_support";

type DraggableTextProperties = {
  textAlign: TextAttributes["textAlign"];
  fontWeight: FontWeight;
  fontStyle: TextAttributes["fontStyle"];
  decoration: TextAttributes["decoration"];
};

const content = "Add a little bit of body text";

export const App = () => {
  const [{ fontStyle, fontWeight, decoration, textAlign }, setState] = useState<
    Required<DraggableTextProperties>
  >({
    decoration: "none",
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "start",
  });
  const addElement = useAddElement();
  const isSupported = useFeatureSupport();
  const isRequiredFeatureSupported = isSupported(ui.startDragToPoint);

  const onDragStart = (event: React.DragEvent<HTMLElement>) => {
    ui.startDragToPoint(event, {
      type: "text",
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
          <TypographyCard
            ariaLabel="Add text to design"
            onClick={() =>
              addElement({
                type: "text",
                textAlign,
                decoration,
                fontStyle,
                fontWeight,
                children: [content],
              })
            }
            onDragStart={isRequiredFeatureSupported ? onDragStart : undefined}
          >
            <Text
              variant={
                ["semibold", "bold", "heavy"].includes(fontWeight)
                  ? "bold"
                  : "regular"
              }
            >
              {content}
            </Text>
          </TypographyCard>
          {!isRequiredFeatureSupported && <UnsupportedAlert />}
        </Rows>
      </Rows>
    </div>
  );
};

const UnsupportedAlert = () => (
  <Alert tone="warn">
    Sorry, the required feature is not supported in the current design.
  </Alert>
);
