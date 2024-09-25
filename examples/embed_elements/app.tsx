import { useCallback, useState } from "react";
import * as styles from "styles/components.css";
import { Button, FormField, Rows, Text, TextInput } from "@canva/app-ui-kit";
import { useAddElement } from "utils/use_add_element";

export const App = () => {
  const [url, setUrl] = useState("https://www.youtube.com/watch?v=o-YBDTqX_ZU");
  const addElement = useAddElement();

  const disabled = url.trim().length < 1;

  const addEmbed = useCallback(() => {
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
          disabled={disabled}
          stretch
        >
          Add element
        </Button>
      </Rows>
    </div>
  );
};
