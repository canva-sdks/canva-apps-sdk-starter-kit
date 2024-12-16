import { Button, Rows, Text } from "@canva/app-ui-kit";
import { editContent } from "@canva/design";
import * as styles from "styles/components.css";

export const App = () => {
  const updateFormatting = async () => {
    editContent(
      {
        contentType: "richtext",
        target: "current_page",
      },
      async (session) => {
        for (const richtext of session.contents) {
          const regions = richtext.readTextRegions();
          let index = 0;
          regions.forEach((region) => {
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
        await session.sync();
      },
    );
  };

  const appendText = async () => {
    editContent(
      {
        contentType: "richtext",
        target: "current_page",
      },
      async (session) => {
        session.contents.forEach((richtext) => richtext.appendText("!"));
        await session.sync();
      },
    );
  };

  const replaceText = async () => {
    editContent(
      {
        contentType: "richtext",
        target: "current_page",
      },
      async (session) => {
        for (const richtext of session.contents) {
          const plaintext = richtext.readPlaintext();
          richtext.replaceText(
            { index: 0, length: plaintext.length },
            "Hello World",
            { decoration: "underline" },
          );
        }
        await session.sync();
      },
    );
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can update all text in the current
          page.
        </Text>
        <Button variant="secondary" onClick={updateFormatting}>
          Toggle boldness
        </Button>
        <Button variant="secondary" onClick={appendText}>
          Append "!"
        </Button>
        <Button variant="secondary" onClick={replaceText}>
          Replace with underlined "Hello World"
        </Button>
      </Rows>
    </div>
  );
};
