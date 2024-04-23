import { Rows, Swatch, Text } from "@canva/app-ui-kit";
import {
  Anchor,
  ColorSelectionEvent,
  ColorSelectionScope,
  openColorSelector,
} from "@canva/preview/asset";
import React from "react";
import styles from "styles/components.css";

export const App = () => {
  const [color, setColor] = React.useState<string | undefined>(undefined);
  const onColorSelect = async <T extends ColorSelectionScope>(
    e: ColorSelectionEvent<T>
  ) => {
    if (e.selection.type === "solid") {
      setColor(e.selection.hexString);
    }
  };

  const onRequestOpenColorSelector = (boundingRect: Anchor) => {
    openColorSelector(boundingRect, {
      onColorSelect: onColorSelect,
      scopes: ["solid"],
    });
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can pick Brand, Document, and
          custom colors in an app.
        </Text>
        <Swatch
          fill={[color]}
          onClick={(e) =>
            onRequestOpenColorSelector(e.currentTarget.getBoundingClientRect())
          }
        />
      </Rows>
    </div>
  );
};
