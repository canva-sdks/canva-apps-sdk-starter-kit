// For usage information, see the README.md file.
import {
  Button,
  Column,
  Columns,
  FormField,
  MultilineInput,
  Rows,
  Swatch,
  Text,
} from "@canva/app-ui-kit";
import { getDesignColors, type DesignColor } from "@canva/design";
import React, { useState } from "react";
import * as styles from "styles/components.css";

export const App = () => {
  // State to store the design colors retrieved from the Canva Design API
  const [designColors, setDesignColors] = useState<DesignColor[]>([]);

  const handleClick = React.useCallback(async () => {
    // The getDesignColors function returns the colors used in the current design
    const { colors } = await getDesignColors();
    setDesignColors(colors);
  }, []);

  // For this example, we preview up to the first 5 solid colors (gradients are currently not supported).
  const previewColors = designColors
    .filter((designColor) => designColor.type === "solid")
    .slice(0, 5)
    .map((designColor) => designColor.color);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
          This example demonstrates how apps can retrieve the colors used in the
          current design.
        </Text>
        <Button variant="primary" onClick={handleClick} stretch>
          Get design colors
        </Button>

        <Columns spacing="1u">
          {previewColors.map((color, index) => (
            <Column key={`${color}-${index}`} width="content">
              <Swatch fill={[color]} />
            </Column>
          ))}
        </Columns>

        {/* Display the design colors as formatted JSON */}
        <FormField
          label="Design colors"
          value={JSON.stringify(designColors, null, 2)}
          control={(props) => (
            <MultilineInput {...props} maxRows={12} autoGrow readOnly />
          )}
        />
      </Rows>
    </div>
  );
};
