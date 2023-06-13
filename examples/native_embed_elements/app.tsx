import { addNativeElement } from "@canva/design";
import React from "react";
import styles from "styles/components.css";
import { Button, FormField, Rows, Text, TextInput } from "@canva/app-ui-kit";

export const App = () => {
  const [url, setUrl] = React.useState(
    "https://www.youtube.com/watch?v=o-YBDTqX_ZU"
  );
  const disabled = url.trim().length < 1;

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
          This example demonstrates how apps can add native embed elements to a
          design.
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
          onClick={() => {
            addNativeElement({
              type: "EMBED",
              url,
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
