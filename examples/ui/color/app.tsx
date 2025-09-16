// For usage information, see the README.md file.
import { Rows, Swatch, Text } from "@canva/app-ui-kit";
import type {
  Anchor,
  ColorSelectionEvent,
  ColorSelectionScope,
} from "@canva/asset";
import { openColorSelector } from "@canva/asset";
import { useState } from "react";
import * as styles from "styles/components.css";

export const App = () => {
  const [color, setColor] = useState<string | undefined>(undefined);

  // Handle color selection events from the Canva color selector
  // The event provides different selection types (solid, gradient, etc.)
  const onColorSelect = async <T extends ColorSelectionScope>(
    e: ColorSelectionEvent<T>,
  ) => {
    if (e.selection.type === "solid") {
      setColor(e.selection.hexString);
    }
  };

  // Open Canva's built-in color selector modal
  // The boundingRect parameter positions the selector relative to the clicked element
  const onRequestOpenColorSelector = (boundingRect: Anchor) => {
    openColorSelector(boundingRect, {
      onColorSelect,
      scopes: ["solid"], // Restrict to solid colors only
    });
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can pick brand, document, and
          custom colors in an app.
        </Text>
        {/* Canva's Swatch component displays the selected color and triggers color picker */}
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
