// For usage information, see the README.md file.
import { Button, Rows, Text } from "@canva/app-ui-kit";
import { createRichtextRange } from "@canva/design";
import type { TextRegion } from "@canva/design";
import * as styles from "styles/components.css";
import { useEffect, useState } from "react";
import { useAddElement } from "utils/use_add_element";

// Create a global RichtextRange instance - this manages text content and formatting
let richtext = createRichtextRange();

export const App = () => {
  // Track text regions to display the richtext structure
  const [regions, setRegions] = useState<TextRegion[]>([]);
  // Hook to add elements to the Canva design
  const addElement = useAddElement();

  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    // Create a new RichtextRange instance and populate with initial text
    richtext = createRichtextRange();
    richtext.appendText(
      "This is an example richtext.\nUsing the RichtextRange API, individual parts of the text can be formatted.",
    );
    // Update the regions state to reflect the current richtext structure
    setRegions(richtext.readTextRegions());
  };

  const formatText = () => {
    // Apply text-level formatting (color and style) to the first word
    richtext.formatText(
      { index: 0, length: 4 },
      {
        color: "#ff0000",
        fontStyle: "italic",
      },
    );
    setRegions(richtext.readTextRegions());
  };

  const formatParagraph = () => {
    // Apply paragraph-level formatting (font size and alignment) to the second paragraph
    richtext.formatParagraph(
      {
        index: "This is an example richtext.\n".length,
        length: 1,
      },
      {
        fontSize: 40,
        textAlign: "end",
      },
    );
    setRegions(richtext.readTextRegions());
  };

  const replaceText = () => {
    // Replace the first word with alternate text to demonstrate text replacement
    richtext.replaceText(
      {
        index: 0,
        length: 4,
      },
      richtext.readPlaintext().startsWith("This") ? "Here" : "This",
    );
    setRegions(richtext.readTextRegions());
  };

  const appendText = () => {
    // Add additional text to the end of the richtext content
    richtext.appendText(" This is appended text.");
    setRegions(richtext.readTextRegions());
  };

  const addToDesign = async () => {
    // Add the richtext element to the user's Canva design
    await addElement({ type: "richtext", range: richtext });
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>This example demonstrates how apps can add richtext.</Text>
        <Regions regions={regions} />
        <Button variant="secondary" onClick={formatText}>
          Format first word
        </Button>
        <Button variant="secondary" onClick={formatParagraph}>
          Format second paragraph
        </Button>
        <Button variant="secondary" onClick={appendText}>
          Append text
        </Button>
        <Button variant="secondary" onClick={replaceText}>
          Replace first word
        </Button>
        <Button variant="secondary" onClick={reset}>
          Reset
        </Button>
        <Button variant="primary" onClick={addToDesign}>
          Add richtext to design
        </Button>
      </Rows>
    </div>
  );
};

// Display the TextRegion structure to show how richtext is internally represented
const Regions = ({ regions }: { regions: TextRegion[] }) => {
  return (
    <pre style={{ textWrap: "wrap", fontSize: 14 }}>
      {JSON.stringify(regions, null, 2)}
    </pre>
  );
};
