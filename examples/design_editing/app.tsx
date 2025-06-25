/**
 * Static images are used here for demonstration purposes only.
 * In a real app, you should use a CDN/hosting service to host your images,
 * then upload them to Canva using the `upload` function from the `@canva/asset` package.
 */
/* eslint-disable no-restricted-imports */
import { Button, Rows, Text, Alert } from "@canva/app-ui-kit";
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
  GROUP,
  INSERT_AND_GROUP,
}

export const App = () => {
  const [operation, setOperation] = useState<Operation>(Operation.NONE);
  const [error, setError] = useState<string | undefined>(undefined);

  // This is a helper function to check that the page we retrieved is
  // an "Absolute" page. Other pages are not supported by the API.
  function checkAbsolute(
    page: DesignEditing.Page,
  ): asserts page is DesignEditing.AbsolutePage {
    if (page.type !== "absolute") {
      setError("Page type is not supported");
      throw new Error("Page type is not supported");
    } else {
      setError(undefined);
    }
  }

  // This method shows how to replace all fills on the page
  // with an image
  const replaceAllFillsWithDogs = () => {
    openDesign({ type: "current_page" }, async (session) => {
      // Check that we're on a supported page
      checkAbsolute(session.page);

      // Find all elements on the page that can contain a fill
      const elementsToReplace = session.page.elements.filter(
        (el) => el.type === "rect" || el.type === "shape",
      );

      if (elementsToReplace.length === 0) {
        return;
      }

      setOperation(Operation.UPDATE);

      // Upload the image we want to use
      const dogImage = await uploadLocalImage();
      const dogMedia: DesignEditing.ImageFill = {
        type: "image",
        flipX: false,
        flipY: false,
        imageRef: dogImage.ref,
      };

      // For each element, update the fills to contain our new image
      elementsToReplace.forEach((element) => {
        switch (element.type) {
          case "rect":
            element.fill.mediaContainer.set(dogMedia);
            break;
          case "shape":
            // Some shape paths cannot be edited, so we need to check for this
            element.paths.forEach(
              (p) =>
                p.fill.isMediaEditable && p.fill.mediaContainer.set(dogMedia),
            );
            break;
          default:
            throw new Error("Unexpected Element");
        }
      });
      // Save the changes
      return session.sync();
    })
      .catch((e) => (e instanceof Error ? setError(e.message) : setError(e)))
      .finally(() => setOperation(Operation.NONE));
  };

  // This method flips the design around the Y-axis
  const flipDesign = () => {
    openDesign({ type: "current_page" }, async (session) => {
      checkAbsolute(session.page);
      // Whiteboards do not have static dimensions, so we can use this to figure out
      // the dimensions that bound the elements
      const dimensions = findElementsBoundingBox(session.page.elements);

      // For designs with static dimensions, the center is just half the width.
      const pageCenter = session.page.dimensions
        ? session.page.dimensions.width / 2
        : dimensions.centerX;

      session.page.elements
        .filter((element) => element.type !== "unsupported")
        .forEach((element) => {
          // compute new x-position by flipping elements around the center
          element.left = 2 * pageCenter - element.left - element.width;
          // also horizontally flip any media
          if (
            element.type === "rect" &&
            element.fill.mediaContainer.ref != null
          ) {
            element.fill.mediaContainer.ref.flipX =
              !element.fill.mediaContainer.ref.flipX;
          }
          if (element.type === "shape") {
            element.paths.forEach((path) => {
              if (path.fill.mediaContainer.ref != null) {
                path.fill.mediaContainer.ref.flipX =
                  !path.fill.mediaContainer.ref.flipX;
              }
            });
          }
        });

      setOperation(Operation.FLIP);
      // Save the changes to the design
      return session.sync();
    })
      .catch((e) => (e instanceof Error ? setError(e.message) : setError(e)))
      .finally(() => setOperation(Operation.NONE));
  };

  // This shows an example of how to delete elements
  const deleteAllTextElements = () => {
    openDesign({ type: "current_page" }, async (session) => {
      // Check that we're on a supported page
      checkAbsolute(session.page);
      const page = session.page;
      // Delete all text elements
      page.elements.forEach((element) => {
        if (element.type === "text") {
          page.elements.delete(element);
        }
      });

      setOperation(Operation.DELETE);
      // Save the changes to the design
      return session.sync();
    })
      .catch((e) => (e instanceof Error ? setError(e.message) : setError(e)))
      .finally(() => setOperation(Operation.NONE));
  };

  // This examples shows how you can add elements to the design
  const addTextWithSparkles = () => {
    setOperation(Operation.INSERT);
    openDesign({ type: "current_page" }, async (session) => {
      // Check that we're on a supported page
      checkAbsolute(session.page);
      // The elementStateBuilder provides convenience methods for creating new elements
      const { elementStateBuilder } = session.helpers;
      const { ref } = await uploadSparkle();
      const text = elementStateBuilder.createRichtextRange();
      text.appendText("Hello World");
      text.formatParagraph({ index: 0, length: 11 }, { fontSize: 60 });

      // Add text element to design
      // Note that the only way to add elements to a design is to insert
      // the element into a page's elements list
      const insertedText = session.page.elements.insertBefore(
        undefined,
        elementStateBuilder.createTextElement({
          text: { regions: text.readTextRegions() },
          left: (session.page.dimensions?.width || 0) / 2 - 160,
          top: (session.page.dimensions?.height || 0) / 2 - 160,
          width: 320,
        }),
      );

      if (!insertedText) {
        throw new Error(" Could not insert text");
      }

      // Insert a sparkle behind the text
      session.page.elements.insertBefore(
        insertedText,
        elementStateBuilder.createRectElement({
          left: insertedText.left - 25,
          top: insertedText.top - 10,
          width: 50,
          height: 50,
          fill: {
            mediaContainer: {
              imageRef: ref,
              type: "image",
            },
          },
        }),
      );

      // Insert a sparkle in front of the text
      session.page.elements.insertAfter(
        insertedText,
        elementStateBuilder.createRectElement({
          left: insertedText.left + 280,
          top: insertedText.top + 20,
          width: 50,
          height: 50,
          fill: {
            mediaContainer: {
              imageRef: ref,
              type: "image",
            },
          },
        }),
      );

      // Save the changes to the design
      return session.sync();
    })
      .catch((e) => (e instanceof Error ? setError(e.message) : setError(e)))
      .finally(() => setOperation(Operation.NONE));
  };

  // This example shows how to use a helper to group elements
  async function groupAllSupportedElements() {
    return openDesign({ type: "current_page" }, async (session) => {
      // Check that we're on a supported page
      checkAbsolute(session.page);
      const { group } = session.helpers;

      // get all elements on the page that can be grouped
      const elsToGroup = session.page.elements.filter(
        (el) =>
          el.type === "embed" ||
          el.type === "rect" ||
          el.type === "shape" ||
          el.type === "text",
      );
      if (elsToGroup.length < 2) {
        setError(
          "Need at least 2 supported elements (embed, rect, shape or text) to group them",
        );
        return;
      }
      setOperation(Operation.GROUP);
      // Group the elements
      await group({ elements: elsToGroup });
      // Save the changes to the design
      await session.sync();
    })
      .catch((e) => (e instanceof Error ? setError(e.message) : setError(e)))
      .finally(() => setOperation(Operation.NONE));
  }

  // This shows an example of how to add a group to a page
  async function insertAndGroup() {
    return openDesign({ type: "current_page" }, async (session) => {
      // Check that we're on a supported page
      checkAbsolute(session.page);
      const { group, elementStateBuilder } = session.helpers;
      const width = session.page.dimensions?.width || 0;
      const height = session.page.dimensions?.height || 0;

      // Create the elements we want in the group
      const shape = session.page.elements.insertBefore(
        undefined,
        elementStateBuilder.createShapeElement({
          top: (height ? height / 2 : 0) - 300,
          left: (width ? width / 2 : 0) - 300,
          width: 600,
          height: 600,
          viewBox: {
            top: 0,
            left: 0,
            width: 64,
            height: 64,
          },
          paths: [
            {
              d: "M32 0L36.5053 3.55458L41.8885 1.56619L45.0749 6.33901L50.8091 6.11146L52.3647 11.6353L57.8885 13.1909L57.661 18.9251L62.4338 22.1115L60.4454 27.4947L64 32L60.4454 36.5053L62.4338 41.8885L57.661 45.0749L57.8885 50.8091L52.3647 52.3647L50.8091 57.8885L45.0749 57.661L41.8885 62.4338L36.5053 60.4454L32 64L27.4947 60.4454L22.1115 62.4338L18.9251 57.661L13.1909 57.8885L11.6353 52.3647L6.11146 50.8091L6.33901 45.0749L1.56619 41.8885L3.55458 36.5053L0 32L3.55458 27.4947L1.56619 22.1115L6.33901 18.9251L6.11146 13.1909L11.6353 11.6353L13.1909 6.11146L18.9251 6.33901L22.1115 1.56619L27.4947 3.55458L32 0Z",
              fill: {
                colorContainer: {
                  color: "#ffde59",
                  type: "solid",
                },
              },
            },
          ],
        }),
      );

      if (shape == null) {
        setError("Could not create shape element");
        return;
      }

      const textRange = elementStateBuilder.createRichtextRange();
      textRange.appendText("Well Done!");
      textRange.formatParagraph(
        { index: 0, length: 11 },
        { fontSize: 45, color: "#000000", textAlign: "center" },
      );

      const text = session.page.elements.insertAfter(
        shape,
        elementStateBuilder.createTextElement({
          top: shape.top + shape.height / 2 - 30,
          left: shape.left,
          width: shape?.width,
          text: { regions: textRange.readTextRegions() },
        }),
      );

      if (text == null) {
        setError("Could not create text element");
        return;
      }

      setOperation(Operation.INSERT_AND_GROUP);
      // Group the elements we created
      await group({ elements: [shape, text] });
      // Save the changes to the design
      await session.sync();
    })
      .catch((e) => (e instanceof Error ? setError(e.message) : setError(e)))
      .finally(() => setOperation(Operation.NONE));
  }

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>This example demonstrates how apps can edit the design</Text>
        {error && <Alert tone="critical">{error}</Alert>}
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
        <Button
          variant="secondary"
          onClick={groupAllSupportedElements}
          disabled={operation !== Operation.NONE}
          loading={operation === Operation.GROUP}
        >
          Group elements on page
        </Button>
        <Button
          variant="secondary"
          onClick={insertAndGroup}
          disabled={operation !== Operation.NONE}
          loading={operation === Operation.INSERT_AND_GROUP}
        >
          Insert a group of Elements
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

function findElementsBoundingBox(elements: DesignEditing.ElementList) {
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
