import React, { useEffect, useState } from "react";
import { Button, Rows, Text } from "@canva/app-ui-kit";
import { selection, SelectionEvent } from "@canva/preview/design";
import styles from "styles/components.css";

export const App = () => {
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

  const updateFormatting = async () => {
    const draft = await selectionState!.read();
    for (const richtext of draft.contents) {
      const regions = await richtext.readTextRegions();
      let index = 0;
      regions.forEach((region) => {
        richtext.formatText(
          { index, length: region.text.length },
          {
            fontWeight:
              region.formatting?.fontWeight === "bold" ? "normal" : "bold",
          }
        );
        index = index + region.text.length;
      });
    }
    await draft.save();
  };

  const appendText = async () => {
    const draft = await selectionState!.read();
    draft.contents.forEach((richtext) => richtext.appendText("!"));
    await draft.save();
  };

  const replaceText = async () => {
    const draft = await selectionState!.read();
    for (const richtext of draft.contents) {
      const plaintext = await richtext.readPlaintext();
      richtext.replaceText(
        { index: 0, length: plaintext.length },
        "Hello World",
        { decoration: "underline" }
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
          Toggle boldness
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
