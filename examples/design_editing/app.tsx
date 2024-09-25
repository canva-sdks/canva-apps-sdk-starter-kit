import { Button, Rows, Text } from "@canva/app-ui-kit";
import { upload } from "@canva/asset";
import type { DesignEditing } from "@canva/design";
import { openDesign } from "@canva/design";
import dog from "assets/images/dog.jpg";
import sparkle from "assets/images/sparkle.png";
import { useState } from "react";
import * as styles from "styles/components.css";

enum Operation {
  NONE,
  UPDATE,
  FLIP,
  DELETE,
  INSERT,
}

export const App = () => {
  const [operation, setOperation] = useState<Operation>(Operation.NONE);
  const replaceAllFillsWithDogs = () => {
    openDesign({ type: "current_page" }, async (draft) => {
      const elementsToReplace = draft.page.elements.filter(
        (el) => el.type === "rect" || el.type === "shape",
      );

      if (elementsToReplace.length === 0) {
        return;
      }

      const dogImage = await uploadLocalImage();
      const dogMedia: DesignEditing.ImageFill = {
        type: "image",
        flipX: false,
        flipY: false,
        imageRef: dogImage.ref,
      };
      elementsToReplace.forEach((element) => {
        switch (element.type) {
          case "rect":
            element.fill.media = dogMedia;
            break;
          case "shape":
            element.paths.forEach((p) => (p.fill.media = dogMedia));
            break;
          default:
            throw new Error("Unexpected Element");
        }
      });

      setOperation(Operation.UPDATE);
      return draft.save().finally(() => setOperation(Operation.NONE));
    });
  };

  const flipDesign = () => {
    openDesign({ type: "current_page" }, async (draft) => {
      // Whiteboards do not have fixed dimensions, so we can use this to figure out
      // the dimensions that bound the elements
      const dimensions = findElementsBoundingBox(draft.page.elements);

      // For designs with fixed dimensions, the center is just half the width.
      const pageCenter = draft.page.dimensions
        ? draft.page.dimensions.width / 2
        : dimensions.centerX;

      draft.page.elements.forEach((element) => {
        // compute new x-position by flipping elements around the center
        element.left = 2 * pageCenter - element.left - element.width;
        // also horizontally flip any media
        if (element.type === "rect" && element.fill.media != null) {
          element.fill.media.flipX = !element.fill.media.flipX;
        }
        if (element.type === "shape") {
          element.paths.forEach((path) => {
            if (path.fill.media != null) {
              path.fill.media.flipX = !path.fill.media.flipX;
            }
          });
        }
      });

      setOperation(Operation.FLIP);
      return draft.save().finally(() => setOperation(Operation.NONE));
    });
  };

  const deleteAllTextElements = () => {
    openDesign({ type: "current_page" }, async (draft) => {
      draft.page.elements.forEach((element) => {
        if (element.type === "text") {
          draft.page.elements.delete(element);
        }
      });

      setOperation(Operation.DELETE);
      return draft.save().finally(() => setOperation(Operation.NONE));
    });
  };

  const addTextWithSparkles = () => {
    openDesign({ type: "current_page" }, async (draft, { elementBuilder }) => {
      const { ref } = await uploadSparkle();
      const text = elementBuilder.createRichtextRange();
      text.appendText("Hello World");
      text.formatParagraph({ index: 0, length: 11 }, { fontSize: 60 });
      // Add text element to design
      const insertedText = draft.page.elements.insertBefore(
        undefined,
        elementBuilder.createTextElement({
          text,
          left: (draft.page.dimensions?.width || 0) / 2 - 160,
          top: (draft.page.dimensions?.height || 0) / 2 - 160,
          width: 320,
        }),
      );

      if (!insertedText) {
        throw new Error(" Could not insert text");
      }

      // Insert a sparkle behind the text
      draft.page.elements.insertBefore(
        insertedText,
        elementBuilder.createRectElement({
          left: insertedText.left - 25,
          top: insertedText.top - 10,
          width: 50,
          height: 50,
          fill: {
            media: {
              imageRef: ref,
              type: "image",
            },
          },
        }),
      );

      // Insert a sparkle in front of the text
      draft.page.elements.insertAfter(
        insertedText,
        elementBuilder.createRectElement({
          left: insertedText.left + 280,
          top: insertedText.top + 20,
          width: 50,
          height: 50,
          fill: {
            media: {
              imageRef: ref,
              type: "image",
            },
          },
        }),
      );

      // Save the changes
      setOperation(Operation.INSERT);
      return draft.save().finally(() => setOperation(Operation.NONE));
    });
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>This example demonstrates how apps can edit the design</Text>
        <Button
          variant="secondary"
          onClick={flipDesign}
          disabled={operation !== Operation.NONE}
          loading={operation === Operation.FLIP}
        >
          Flip Design
        </Button>
        <Button
          variant="secondary"
          onClick={deleteAllTextElements}
          disabled={operation !== Operation.NONE}
          loading={operation === Operation.DELETE}
        >
          Delete all Text Elements
        </Button>
        <Button
          variant="secondary"
          onClick={replaceAllFillsWithDogs}
          disabled={operation !== Operation.NONE}
          loading={operation === Operation.UPDATE}
        >
          Replace all fills with dogs
        </Button>
        <Button
          variant="secondary"
          onClick={addTextWithSparkles}
          disabled={operation !== Operation.NONE}
          loading={operation === Operation.INSERT}
        >
          Add some sparkly text
        </Button>
      </Rows>
    </div>
  );
};

function uploadLocalImage() {
  return upload({
    mimeType: "image/jpeg",
    thumbnailUrl: dog,
    type: "image",
    aiDisclosure: "none",
    url: dog,
    width: 100,
    height: 100,
  });
}

function uploadSparkle() {
  return upload({
    mimeType: "image/png",
    thumbnailUrl: sparkle,
    type: "image",
    aiDisclosure: "none",
    url: sparkle,
    width: 538,
    height: 550,
  });
}

function findElementsBoundingBox(
  elements: DesignEditing.List<DesignEditing.FixedElement>,
) {
  const lefts: number[] = [];
  const tops: number[] = [];
  const rights: number[] = [];
  const bottoms: number[] = [];

  elements.forEach((el) => {
    lefts.push(el.left);
    rights.push(el.left + el.width);
    tops.push(el.top);
    bottoms.push(el.top + el.height);
  });

  const left = Math.min(...lefts);
  const right = Math.max(...rights);
  const top = Math.max(...tops);
  const bottom = Math.min(...bottoms);

  return {
    left,
    top,
    width: right - left,
    height: bottom - top,
    centerX: (right + left) / 2,
  };
}
