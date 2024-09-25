import { Button, Rows, Text } from "@canva/app-ui-kit";
import { createRichtextRange } from "@canva/design";
import type { TextRegion } from "@canva/design";
import * as styles from "styles/components.css";
import { useEffect, useState } from "react";
import { useAddElement } from "utils/use_add_element";

let richtext = createRichtextRange();
export const App = () => {
  const [regions, setRegions] = useState<TextRegion[]>([]);
  const addElement = useAddElement();

  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    richtext = createRichtextRange();
    richtext.appendText(
      "This is an example richtext.\nUsing the RichtextRange API, individual parts of the text can be formatted.",
    );
    setRegions(richtext.readTextRegions());
  };

  const formatText = () => {
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
    richtext.appendText(" This is appended text.");
    setRegions(richtext.readTextRegions());
  };

  const addToDesign = async () => {
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

const Regions = ({ regions }: { regions: TextRegion[] }) => {
  return (
    <pre style={{ textWrap: "wrap", fontSize: 14 }}>
      {JSON.stringify(regions, null, 2)}
    </pre>
  );
};
