import { Button, Rows, Text } from "@canva/app-ui-kit";
import { editContent } from "@canva/design";
import * as styles from "styles/components.css";
import { convertWordsToLorem } from "./lorem_generator";
import { useState } from "react";

const enum Task {
  WITH_FORMATTING,
  WITHOUT_FORMATTING,
}

export const App = () => {
  // This state controls the buttons in the app. It is used to disable them while a translation is in progress.
  const [inProgressTask, setInProgressTask] = useState<Task | undefined>(
    undefined,
  );
  /**
   * Translates the text on the page while ignoring any inline formatting.
   * This implementation provides a simpler approach, making it an ideal starting point
   * for understanding the basics of text editing functionality.
   */
  const translateWithoutFormatting = async () => {
    setInProgressTask(Task.WITHOUT_FORMATTING);
    // Read the richtext content in the current page.
    await editContent(
      {
        contentType: "richtext",
        target: "current_page",
      },
      async (session) => {
        // create a request object by simply reading the plaintext of each text object in the page
        const request: string[][] = session.contents.map((range) => [
          range.readPlaintext(),
        ]);

        // This simulates an HTTP request to get the translation. For this example we translate into
        // lorem ipsum.
        const response = await getTranslation(request);

        // Take the contents object and get the text ranges. Because of our translate function we know that
        // each entry in the response corresponds to a range in the contents array.
        session.contents.forEach((range, i) => {
          // Get the text length of the existing text in the document
          const length = range.readPlaintext().length;
          // Replace all of the text in the design with the response from the translation request.
          range.replaceText({ index: 0, length }, response[i][0]);
        });

        // Save the changes to the design
        await session.sync();
      },
    );
    setInProgressTask(undefined);
  };

  /**
   * Translates the text in the page while respecting inline formatting.
   * If this looks too complicated, look to the `translateWithoutFormatting` method above to help learn the basics.
   */
  const translateWithFormatting = async () => {
    setInProgressTask(Task.WITH_FORMATTING);
    // Read the richtext content in the current page.
    await editContent(
      {
        contentType: "richtext",
        target: "current_page",
      },
      async (session) => {
        // create a request object by reading the attributed regions of each text object in the page
        const request = session.contents.map((range) =>
          range.readTextRegions().map((region) => region.text),
        );

        // This simulates an HTTP request to get the translation. For this example we translate into
        // lorem ipsum.
        const response = await getTranslation(request);

        // For each richtext object we queried, apply the translation
        session.contents.forEach((range, index) => {
          // Get the translation corresponding to the text object. Each entry contains an array of translations.
          // Each translation is an array of strings with each entry corresponding to an entry in the text region array.
          const translatedRegions = response[index];
          // Get the endpoint of the text represented by the region.
          let endOfRegion = range.readPlaintext().length;
          // Read the richtext objects as text regions
          const regionsToTranslate = range.readTextRegions();
          // Reverse the regions and then iterate on them.
          // We reverse it because when doing text replacement, changing text length would need us to recalculate regions.
          // However ny changing the text from the back first we can avoid these recalculations.
          regionsToTranslate.reverse().forEach((region, i) => {
            // Get the end of the previous region (which also serves as the start of the current region)
            endOfRegion = endOfRegion - region.text.length;
            // Replace the current region (starting at the end of the previous region with length equal to the length of the text in the region)
            // with the translated text.
            range.replaceText(
              {
                index: endOfRegion,
                length: region.text.length,
              },
              translatedRegions[regionsToTranslate.length - 1 - i],
            );
          });
        });

        // Save the changes to the design
        await session.sync();
      },
    );
    setInProgressTask(undefined);
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can translate all text in the
          current page
        </Text>
        <Button
          variant="secondary"
          onClick={translateWithFormatting}
          disabled={inProgressTask != null}
          loading={inProgressTask === Task.WITH_FORMATTING}
        >
          Translate with Formatting
        </Button>
        <Button
          variant="secondary"
          onClick={translateWithoutFormatting}
          disabled={inProgressTask != null}
          loading={inProgressTask === Task.WITHOUT_FORMATTING}
        >
          Translate without Formatting
        </Button>
      </Rows>
    </div>
  );
};

/**
 * A function that simulates a request to translate some text
 * @param text the text chunks to translate
 * @returns the translated text chunks
 */
async function getTranslation(text: string[][]): Promise<string[][]> {
  await new Promise((res) => setTimeout(res, 500));
  return text.map((t) => convertWordsToLorem(t));
}
