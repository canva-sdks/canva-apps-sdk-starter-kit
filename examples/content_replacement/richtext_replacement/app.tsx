// For usage information, see the README.md file.
import { Button, Rows, Text } from "@canva/app-ui-kit";
import { useEffect, useState } from "react";
import type { SelectionEvent } from "@canva/design";
import { selection } from "@canva/design";
import * as styles from "styles/components.css";

export const App = () => {
  // State to track the current selection of richtext elements
  const [selectionState, setSelectionState] = useState<
    SelectionEvent<"richtext">
  >({
    count: 0,
    scope: "richtext",
    read: () =>
      Promise.resolve({
        contents: [],
        save: () => Promise.resolve(),
      }),
  });

  // Register for selection changes to enable text manipulation when text is selected
  useEffect(() => {
    selection.registerOnChange({
      scope: "richtext",
      onChange: (evt) => {
        if (evt.count > 0) {
          setSelectionState(evt);
        }
      },
    });
  }, []);

  // Toggles bold formatting for the selected richtext by reading current formatting
  // and applying the opposite state
  const updateFormatting = async () => {
    if (!selectionState) {
      return;
    }

    // Create a draft to make changes to the selected richtext
    const draft = await selectionState.read();
    for (const richtext of draft.contents) {
      // Read text regions to access formatting information
      const regions = await richtext.readTextRegions();
      let index = 0;
      regions.forEach((region) => {
        // Toggle bold state: if currently bold, make normal; if normal, make bold
        richtext.formatText(
          { index, length: region.text.length },
          {
            fontWeight:
              region.formatting?.fontWeight === "bold" ? "normal" : "bold",
          },
        );
        index = index + region.text.length;
      });
    }
    // Save changes to apply them to the design
    await draft.save();
  };

  // Appends an exclamation mark to the end of selected richtext elements
  const appendText = async () => {
    if (!selectionState) {
      return;
    }

    const draft = await selectionState.read();
    // Append text to each selected richtext element
    draft.contents.forEach((richtext) => richtext.appendText("!"));
    await draft.save();
  };

  // Replaces all selected richtext content with underlined "Hello World"
  const replaceText = async () => {
    if (!selectionState) {
      return;
    }

    const draft = await selectionState.read();
    for (const richtext of draft.contents) {
      // Get the current text length to replace the entire content
      const plaintext = await richtext.readPlaintext();
      // Replace all text with "Hello World" and apply underline formatting
      richtext.replaceText(
        { index: 0, length: plaintext.length },
        "Hello World",
        { decoration: "underline" },
      );
    }
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
          onClick={updateFormatting}
          disabled={selectionState.count === 0}
        >
          Toggle bold
        </Button>
        <Button
          variant="primary"
          onClick={appendText}
          disabled={selectionState.count === 0}
        >
          Append "!"
        </Button>
        <Button
          variant="primary"
          onClick={replaceText}
          disabled={selectionState.count === 0}
        >
          Replace with underlined "Hello World"
        </Button>
      </Rows>
    </div>
  );
};
