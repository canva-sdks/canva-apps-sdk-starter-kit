import { Button, Rows, Text } from "@canva/app-ui-kit";
import { addNativeElement } from "@canva/design";
import * as React from "react";
import styles from "styles/components.css";

export const App = () => {
  const onClick = () => {
    addNativeElement({
      type: "TEXT",
      children: ["Hello world!"],
    });
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          To make changes to this app, edit the <code>src/app.tsx</code> file,
          then close and reopen the app in the editor to preview the changes.
        </Text>
        <Button variant="primary" onClick={onClick} stretch>
          Do something cool
        </Button>
      </Rows>
    </div>
  );
};
