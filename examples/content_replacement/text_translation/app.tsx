// For usage information, see the README.md file.
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
    // Start a content editing session for all richtext elements on the current page
    await editContent(
      {
        contentType: "richtext",
        target: "current_page",
      },
      async (session) => {
        // Extract plaintext from each richtext element, ignoring any formatting like bold, italic, etc.
        const request: string[][] = session.contents.map((range) => [
          range.readPlaintext(),
        ]);

        // Simulate a translation API call (in production, this would call a real translation service)
        const response = await getTranslation(request);

        // Apply translations to each richtext element in the design
        session.contents.forEach((range, i) => {
          // Get the length of the original text to know how much to replace
          const length = range.readPlaintext().length;
          // Replace the entire text content with the translated text
          const translatedText = response[i]?.[0];
          if (translatedText) {
            range.replaceText({ index: 0, length }, translatedText);
          }
        });

        // Commit all changes to the design - this makes the changes visible to the user
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
    // Start a content editing session for all richtext elements on the current page
    await editContent(
      {
        contentType: "richtext",
        target: "current_page",
      },
      async (session) => {
        // Extract text regions which preserve formatting boundaries (bold, italic, etc.)
        const request = session.contents.map((range) =>
          range.readTextRegions().map((region) => region.text),
        );

        // Simulate a translation API call (in production, this would call a real translation service)
        const response = await getTranslation(request);

        // Apply translations to each richtext element while preserving formatting
        session.contents.forEach((range, index) => {
          // Get the translated regions corresponding to this text element
          const translatedRegions = response[index];
          // Track position from the end of the text to avoid index recalculation during replacement
          let endOfRegion = range.readPlaintext().length;
          // Get all text regions with their formatting information
          const regionsToTranslate = range.readTextRegions();
          // Process regions in reverse order to avoid position shifts affecting subsequent replacements
          regionsToTranslate.reverse().forEach((region, i) => {
            // Calculate the start position of the current region
            endOfRegion = endOfRegion - region.text.length;
            // Replace the current region (starting at the end of the previous region with length equal to the length of the text in the region)
            // with the translated text.
            const translatedText =
              translatedRegions?.[regionsToTranslate.length - 1 - i];
            if (translatedText) {
              range.replaceText(
                {
                  index: endOfRegion,
                  length: region.text.length,
                },
                translatedText,
              );
            }
          });
        });

        // Commit all changes to the design - this makes the changes visible to the user
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
          Translate with formatting
        </Button>
        <Button
          variant="secondary"
          onClick={translateWithoutFormatting}
          disabled={inProgressTask != null}
          loading={inProgressTask === Task.WITHOUT_FORMATTING}
        >
          Translate without formatting
        </Button>
      </Rows>
    </div>
  );
};

/**
 * Mock function that simulates calling an external translation API.
 * In a production app, this would make HTTP requests to services like Google Translate,
 * AWS Translate, or Azure Translator Text.
 * @param text Array of text chunks to translate, grouped by richtext element
 * @returns Promise resolving to translated text chunks in the same structure
 */
async function getTranslation(text: string[][]): Promise<string[][]> {
  // Simulate network delay that would occur with a real translation API
  await new Promise((res) => setTimeout(res, 500));
  // Convert to lorem ipsum as a placeholder for actual translation
  return text.map((t) => convertWordsToLorem(t));
}
