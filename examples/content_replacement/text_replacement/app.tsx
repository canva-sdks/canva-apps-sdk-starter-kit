// For usage information, see the README.md file.
import { Button, Rows, Text } from "@canva/app-ui-kit";
import { useSelection } from "utils/use_selection_hook";
import * as styles from "styles/components.css";

export const App = () => {
  // Hook to track plaintext selection in the Canva editor
  const selection = useSelection("plaintext");

  const updateText = async () => {
    // Create a draft of the selected text elements to enable modification
    const draft = await selection.read();
    // Iterate through all selected text elements and append '!' to each
    draft.contents.forEach((s) => (s.text = `${s.text}!`));
    // Apply the changes to the design
    await draft.save();
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can replace the selected text.
          Select text in the editor to begin.
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
