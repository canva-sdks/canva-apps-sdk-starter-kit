// For usage information, see the README.md file.
import { useCallback, useState } from "react";
import * as styles from "styles/components.css";
import { Button, FormField, Rows, Text, TextInput } from "@canva/app-ui-kit";
import { addElementAtCursor, addElementAtPoint } from "@canva/design";
import { useFeatureSupport } from "@canva/app-hooks";

export const App = () => {
  const [url, setUrl] = useState(
    "https://www.youtube.com/embed/L3MtFGWRXAA?si=duU555FqmToATe2j",
  );
  // Hook for adding design elements to the current Canva design
  const isSupported = useFeatureSupport();
  const addElement = [addElementAtPoint, addElementAtCursor].find((fn) =>
    isSupported(fn),
  );

  const disabled = url.trim().length < 1;

  const addEmbed = useCallback(() => {
    if (!addElement) {
      return;
    }

    // Add an embed element to the design using the embed element API
    // Supports URLs from platforms like YouTube, Vimeo, Spotify, etc.
    addElement({
      type: "embed",
      url,
    });
  }, [url, addElement]);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
          This example demonstrates how apps can add embed elements to a design.
        </Text>
        <FormField
          label="URL"
          value={url}
          control={(props) => (
            <TextInput
              {...props}
              onChange={(value) => {
                setUrl(value);
              }}
            />
          )}
        />
        <Button
          variant="primary"
          onClick={addEmbed}
          disabled={disabled || !addElement}
          tooltipLabel={
            !addElement
              ? "This feature is not supported in the current page"
              : undefined
          }
          stretch
        >
          Add element
        </Button>
      </Rows>
    </div>
  );
};
