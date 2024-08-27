import { Button, Rows, Text } from "@canva/app-ui-kit";
import { useSelection } from "utils/use_selection_hook";
import * as styles from "styles/components.css";

export const App = () => {
  const selection = useSelection("plaintext");

  const updateText = async () => {
    const draft = await selection.read();
    draft.contents.forEach((s) => (s.text = `${s.text}!`));
    await draft.save();
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can replace the selected text.
          Select a text in the editor to begin.
        </Text>
        <Button
          variant="primary"
          onClick={updateText}
          disabled={selection.count === 0}
        >
          Append '!'
        </Button>
      </Rows>
    </div>
  );
};
