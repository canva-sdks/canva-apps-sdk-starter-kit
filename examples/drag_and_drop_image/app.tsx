import { Rows, Text, Title } from "@canva/app-ui-kit";
import { upload } from "@canva/asset";
import dog from "assets/images/dog.jpg";
import { DraggableImage } from "components/draggable_image";
import React from "react";
import styles from "styles/components.css";

const uploadImage = async () => {
  const image = await upload({
    // An alphanumeric string that is unique for each asset. If given the same
    // id, the existing asset for that id will be used instead.
    id: "uniqueImageIdentifier",
    mimeType: "image/jpeg",
    thumbnailUrl:
      "https://www.canva.dev/example-assets/image-import/grass-image-thumbnail.jpg",
    type: "IMAGE",
    url: "https://www.canva.dev/example-assets/image-import/grass-image.jpg",
    width: 320,
    height: 212,
  });

  return image;
};

export const App = () => {
  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
          This example demonstrates how apps can support drag-and-drop of
          images.
        </Text>
        <Rows spacing="1u">
          <Title size="small">Default size</Title>
          <Text size="small" tone="tertiary">
            This image doesn't alter the{" "}
            <code className={styles.code}>dragData</code>, so the dragged image
            is the default size.
          </Text>
          <DraggableImage
            src={dog}
            style={{ width: "100px", height: "100px", borderRadius: "2px" }}
          />
        </Rows>
        <Rows spacing="1u">
          <Title size="small">Custom size</Title>
          <Text size="small" tone="tertiary">
            This image <em>does</em> alter the{" "}
            <code className={styles.code}>dragData</code>, so the dragged image
            is a custom size.
          </Text>
          <div>
            <DraggableImage
              src={dog}
              style={{ width: "100x", height: "100px", borderRadius: "2px" }}
              fullSize={{
                width: 50,
                height: 50,
              }}
            />
          </div>
        </Rows>
        <Rows spacing="1u">
          <Title size="small">External Image</Title>
          <Text size="small" tone="tertiary">
            This image is an external https image made draggable via drag and
            drop and asset upload.
          </Text>
          <DraggableImage
            src={
              "https://www.canva.dev/example-assets/image-import/grass-image.jpg"
            }
            width="320px"
            height="212px"
            resolveImageRef={uploadImage}
          />
        </Rows>
      </Rows>
    </div>
  );
};
