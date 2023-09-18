import { Button, Rows, Text, Title } from "@canva/app-ui-kit";
import type { NativeEmbedElement, NativeGroupElement } from "@canva/design";
import { CanvaError } from "@canva/error";
import { addPage, getDefaultPageDimensions } from "@canva/preview/design";
import weather from "assets/images/weather.png";
import React from "react";
import styles from "styles/components.css";

const IMAGE_ELEMENT_WIDTH = 50;
const IMAGE_ELEMENT_HEIGHT = 50;
const TEXT_ELEMENT_WIDTH = 130;
const HEADER_ELEMENT_SCALE_FACTOR = 0.2;
const EMBED_ELEMENT_SCALE_FACTOR = 0.4;

const headerElement: NativeGroupElement = {
  type: "GROUP",
  children: [
    {
      type: "IMAGE",
      dataUrl: weather,
      top: 0,
      left: 0,
      width: IMAGE_ELEMENT_WIDTH,
      height: IMAGE_ELEMENT_HEIGHT,
    },
    {
      type: "TEXT",
      children: ["Weather Forecast"],
      top: IMAGE_ELEMENT_HEIGHT,
      left: IMAGE_ELEMENT_WIDTH / 2 - TEXT_ELEMENT_WIDTH / 2,
      width: TEXT_ELEMENT_WIDTH,
    },
  ],
};

const embedElement: NativeEmbedElement = {
  type: "EMBED",
  url: "https://www.youtube.com/watch?v=FItPRwHVaCM",
};

export const App = () => {
  const [error, setError] = React.useState<string | undefined>();
  const addNewPage = async () => {
    try {
      const defaultPageDimensions = await getDefaultPageDimensions();
      const headerElementWidth =
        defaultPageDimensions.width * HEADER_ELEMENT_SCALE_FACTOR;
      const embedElementWidth =
        defaultPageDimensions.width * EMBED_ELEMENT_SCALE_FACTOR;
      await addPage({
        elements: [
          {
            ...headerElement,
            width: headerElementWidth,
            height: "auto",
            // Shift from the top by 10%
            top: defaultPageDimensions.height * 0.1,
            // Shift it by 50% of the page width, then subtract 50% of the group element width.
            left: defaultPageDimensions.width / 2 - headerElementWidth / 2,
          },
          // Position the image element in the bottom right corner
          {
            ...embedElement,
            width: embedElementWidth,
            height: "auto",
            // Shift from the top by 40%
            top: defaultPageDimensions.height * 0.4,
            // Shift it by 50% of the page width, then subtract 50% of the group element width.
            left: defaultPageDimensions.width / 2 - embedElementWidth / 2,
          },
        ],
      });
      setError(undefined);
    } catch (e) {
      if (e instanceof CanvaError) {
        switch (e.code) {
          case "QUOTA_EXCEEDED":
            setError(
              "Sorry, you cannot add any more pages. Please remove an existing page and try again."
            );
            break;
          case "RATE_LIMITED":
            setError(
              "Sorry, you can only add up to 3 pages per second. Please try again."
            );
            break;
          default:
            setError(e.message);
            break;
        }
      }
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Title>Pages Example App</Title>
        <Text>
          This example demonstrates how apps can add a new page with
          pre-populated elements.
        </Text>
        {error && <Text tone="critical">{error}</Text>}
        <Button variant="primary" onClick={addNewPage} stretch>
          Add page
        </Button>
      </Rows>
    </div>
  );
};
