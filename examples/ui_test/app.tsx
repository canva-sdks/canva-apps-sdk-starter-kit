import { Button, Rows, Text } from "@canva/app-ui-kit";
import * as styles from "styles/components.css";

export const App = (props: { onClick(): void }) => {
  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>This example demonstrates how to test your App's UI.</Text>
        <Text>
          Checkout <code>examples/ui_test/tests/app.tests.tsx</code> to learn
          how to start testing.
        </Text>
        <Button variant="primary" onClick={props.onClick}>
          Do something cool
        </Button>
      </Rows>
    </div>
  );
};
