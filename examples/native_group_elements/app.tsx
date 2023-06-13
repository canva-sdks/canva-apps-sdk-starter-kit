import React from "react";
import { Button, Rows, Text } from "@canva/app-ui-kit";
import { addNativeElement } from "@canva/design";
import styles from "styles/components.css";

export const App = () => {
  const handleClick = () => {
    addNativeElement({
      type: "GROUP",
      children: [
        {
          type: "EMBED",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          width: 100,
          height: 100,
          top: 0,
          left: 0,
        },
        {
          type: "EMBED",
          url: "https://www.youtube.com/watch?v=o-YBDTqX_ZU",
          width: 100,
          height: 100,
          top: 0,
          left: 100,
        },
      ],
    });
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
          This example demonstrates how apps can create groups of elements.
        </Text>
        <Button variant="primary" onClick={handleClick} stretch>
          Add group element
        </Button>
      </Rows>
    </div>
  );
};
