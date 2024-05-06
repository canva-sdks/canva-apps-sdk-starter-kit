import { Button, Rows, Text } from "@canva/app-ui-kit";
import type {
  Dimensions,
  NativeEmbedElement,
  NativeGroupElement,
} from "@canva/design";
import { addPage, getDefaultPageDimensions } from "@canva/design";
import { CanvaError } from "@canva/error";
import weather from "assets/images/weather.png";
import React from "react";
import styles from "styles/components.css";
import { upload } from "@canva/asset";

const IMAGE_ELEMENT_WIDTH = 50;
const IMAGE_ELEMENT_HEIGHT = 50;
const TEXT_ELEMENT_WIDTH = 130;
const HEADER_ELEMENT_SCALE_FACTOR = 0.2;
const EMBED_ELEMENT_SCALE_FACTOR = 0.4;

const createHeaderElement = async (): Promise<NativeGroupElement> => {
  const { ref } = await upload({
    mimeType: "image/png",
    thumbnailUrl: weather,
    type: "IMAGE",
    url: weather,
    width: 100,
    height: 100,
  });
  return {
    type: "GROUP",
    children: [
      {
        type: "IMAGE",
        ref,
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
};

const embedElement: NativeEmbedElement = {
  type: "EMBED",
  url: "https://www.youtube.com/watch?v=FItPRwHVaCM",
};

export const App = () => {
  const [error, setError] = React.useState<string | undefined>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [defaultPageDimensions, setDefaultPageDimensions] = React.useState<
    Dimensions | undefined
  >();

  React.useEffect(() => {
    getDefaultPageDimensions().then((dimensions) => {
      // Dimensions are undefined if the user is in an unbounded design (e.g. Whiteboard).
      if (!dimensions) {
        setError(
          "Adding pages in unbounded documents, such as Whiteboards, is not supported."
        );
      }
      setDefaultPageDimensions(dimensions);
    });
  }, []);

  const addNewPage = async () => {
    setIsLoading(true);
    try {
      // Dimensions are undefined if the user is in an unbounded design (e.g. Whiteboard).
      if (!defaultPageDimensions) {
        return;
      }
      setError(undefined);
      const headerElementWidth =
        defaultPageDimensions.width * HEADER_ELEMENT_SCALE_FACTOR;
      const embedElementWidth =
        defaultPageDimensions.width * EMBED_ELEMENT_SCALE_FACTOR;
      const headerElement = await createHeaderElement();
      await addPage({
        title: "Weather forecast",
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
          This example demonstrates how apps can add a new page with
          pre-populated elements.
        </Text>
        {error && <Text tone="critical">{error}</Text>}
        <Button
          variant="primary"
          onClick={addNewPage}
          stretch
          // Default page dimensions are undefined in unbounded designs, so the button remains disabled.
          disabled={!defaultPageDimensions}
          loading={isLoading}
        >
          Add page
        </Button>
      </Rows>
    </div>
  );
};
