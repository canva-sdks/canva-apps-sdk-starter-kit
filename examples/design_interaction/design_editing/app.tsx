// For usage information, see the README.md file.
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

  // Helper function to verify the page type. The Design Editing API only supports
  // "absolute" pages (like presentations, posters). Other page types like "flow"
  // pages (docs, whiteboards) are not supported by the Design Editing API.
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

  // Demonstrates updating element properties using the Design Editing API.
  // Shows how to replace fills with uploaded images across multiple elements.
  const replaceAllFillsWithDogs = () => {
    // openDesign creates a Design Editing session for the current page
    openDesign({ type: "current_page" }, async (session) => {
      // Verify we're on a supported page type
      checkAbsolute(session.page);

      // Find elements that support fill modifications (rect and shape elements)
      const elementsToReplace = session.page.elements.filter(
        (el) => el.type === "rect" || el.type === "shape",
      );

      if (elementsToReplace.length === 0) {
        return;
      }

      setOperation(Operation.UPDATE);

      // Upload image using the Asset API and create an ImageFill object
      const dogImage = await uploadLocalImage();
      const dogMedia: DesignEditing.ImageFill = {
        type: "image",
        flipX: false,
        flipY: false,
        imageRef: dogImage.ref,
      };

      // Update each element's fill with the uploaded image
      elementsToReplace.forEach((element) => {
        switch (element.type) {
          case "rect":
            element.fill.mediaContainer.set(dogMedia);
            break;
          case "shape":
            // Shape elements have paths - check if each path's fill can be edited
            element.paths.forEach(
              (p) =>
                p.fill.isMediaEditable && p.fill.mediaContainer.set(dogMedia),
            );
            break;
          default:
            throw new Error("Unexpected Element");
        }
      });
      // Commit all changes to the design using the session.sync() method
      return session.sync();
    })
      .catch((e) => (e instanceof Error ? setError(e.message) : setError(e)))
      .finally(() => setOperation(Operation.NONE));
  };

  // Demonstrates element transformation by flipping the entire design horizontally.
  // Shows how to manipulate element positions and media flip properties.
  const flipDesign = () => {
    openDesign({ type: "current_page" }, async (session) => {
      checkAbsolute(session.page);
      // Calculate bounding box for pages without fixed dimensions (like whiteboards)
      const dimensions = findElementsBoundingBox(session.page.elements);

      // Determine the horizontal center point for flipping calculations
      const pageCenter = session.page.dimensions
        ? session.page.dimensions.width / 2
        : dimensions.centerX;

      // Process all supported elements on the page
      session.page.elements
        .filter((element) => element.type !== "unsupported")
        .forEach((element) => {
          // Mirror element position around the page center
          element.left = 2 * pageCenter - element.left - element.width;
          // Also flip any media content horizontally to maintain visual consistency
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
      // Commit the transformation changes to the design
      return session.sync();
    })
      .catch((e) => (e instanceof Error ? setError(e.message) : setError(e)))
      .finally(() => setOperation(Operation.NONE));
  };

  // Demonstrates element deletion using the Design Editing API.
  // Shows how to remove specific element types from the page.
  const deleteAllTextElements = () => {
    openDesign({ type: "current_page" }, async (session) => {
      // Verify we're on a supported page type
      checkAbsolute(session.page);
      const page = session.page;
      // Remove all text elements from the page using the elements.delete() method
      page.elements.forEach((element) => {
        if (element.type === "text") {
          page.elements.delete(element);
        }
      });

      setOperation(Operation.DELETE);
      // Commit the deletion changes to the design
      return session.sync();
    })
      .catch((e) => (e instanceof Error ? setError(e.message) : setError(e)))
      .finally(() => setOperation(Operation.NONE));
  };

  // Demonstrates element creation and insertion using the Design Editing API.
  // Shows how to create text and image elements and add them to the page.
  const addTextWithSparkles = () => {
    setOperation(Operation.INSERT);
    openDesign({ type: "current_page" }, async (session) => {
      // Verify we're on a supported page type
      checkAbsolute(session.page);
      // Use elementStateBuilder helper to create new elements with proper formatting
      const { elementStateBuilder } = session.helpers;
      const { ref } = await uploadSparkle();
      const text = elementStateBuilder.createRichtextRange();
      text.appendText("Hello World");
      text.formatParagraph({ index: 0, length: 11 }, { fontSize: 60 });

      // Insert text element into the page using the elements.insertBefore() method
      // Elements must be added to the page's elements list to appear in the design
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

      // Create decorative sparkle elements positioned relative to the text
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

      // Insert another sparkle element using insertAfter for z-order control
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

      // Commit all element insertions to the design
      return session.sync();
    })
      .catch((e) => (e instanceof Error ? setError(e.message) : setError(e)))
      .finally(() => setOperation(Operation.NONE));
  };

  // Demonstrates element grouping using the Design Editing API helpers.
  // Shows how to group existing elements on the page together.
  async function groupAllSupportedElements() {
    return openDesign({ type: "current_page" }, async (session) => {
      // Verify we're on a supported page type
      checkAbsolute(session.page);
      const { group } = session.helpers;

      // Filter to get elements that support grouping operations
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
      // Use the group helper to combine elements into a single grouped element
      await group({ elements: elsToGroup });
      // Commit the grouping changes to the design
      await session.sync();
    })
      .catch((e) => (e instanceof Error ? setError(e.message) : setError(e)))
      .finally(() => setOperation(Operation.NONE));
  }

  // Demonstrates creating new elements and immediately grouping them.
  // Shows how to combine element creation, insertion, and grouping operations.
  async function insertAndGroup() {
    return openDesign({ type: "current_page" }, async (session) => {
      // Verify we're on a supported page type
      checkAbsolute(session.page);
      const { group, elementStateBuilder } = session.helpers;
      const width = session.page.dimensions?.width || 0;
      const height = session.page.dimensions?.height || 0;

      // Create a star-shaped element with custom SVG path data
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

      // Create formatted text content using the richtext range builder
      const textRange = elementStateBuilder.createRichtextRange();
      textRange.appendText("Well done!");
      textRange.formatParagraph(
        { index: 0, length: 10 },
        { fontSize: 45, color: "#000000", textAlign: "center" },
      );

      // Insert text element positioned over the star shape
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
      // Group the newly created elements together into a single unit
      await group({ elements: [shape, text] });
      // Commit all creation and grouping operations to the design
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
          Flip design
        </Button>
        <Button
          variant="secondary"
          onClick={deleteAllTextElements}
          disabled={operation !== Operation.NONE}
          loading={operation === Operation.DELETE}
        >
          Delete all text elements
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
          Insert a group of elements
        </Button>
      </Rows>
    </div>
  );
};

// Helper function to upload the dog image asset using the Asset API
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

// Helper function to upload the sparkle image asset using the Asset API
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

// Helper function to calculate the bounding box that contains all elements on a page
// Used for pages without fixed dimensions (like whiteboards) to determine layout bounds
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
