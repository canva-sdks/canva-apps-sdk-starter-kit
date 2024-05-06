import { Rows, Text, Title, ImageCard } from "@canva/app-ui-kit";
import { upload } from "@canva/asset";
import { addNativeElement, ui } from "@canva/design";
import dog from "assets/images/dog.jpg";
import React from "react";
import styles from "styles/components.css";

const uploadExternalImage = () => {
  return upload({
    mimeType: "image/jpeg",
    thumbnailUrl:
      "https://www.canva.dev/example-assets/image-import/grass-image-thumbnail.jpg",
    type: "IMAGE",
    url: "https://www.canva.dev/example-assets/image-import/grass-image.jpg",
    width: 320,
    height: 212,
  });
};

const uploadLocalImage = () => {
  return upload({
    mimeType: "image/jpeg",
    thumbnailUrl: dog,
    type: "IMAGE",
    url: dog,
    width: 100,
    height: 100,
  });
};

const insertLocalImage = async () => {
  const { ref } = await uploadLocalImage();
  await addNativeElement({ type: "IMAGE", ref });
};

const insertExternalImage = async () => {
  const { ref } = await uploadExternalImage();
  await addNativeElement({ type: "IMAGE", ref });
};

export const App = () => {
  const onDragStartForLocalImage = (event: React.DragEvent<HTMLElement>) => {
    ui.startDrag(event, {
      type: "IMAGE",
      resolveImageRef: uploadLocalImage,
      previewUrl: dog,
      previewSize: {
        width: 100,
        height: 100,
      },
      fullSize: {
        width: 100,
        height: 100,
      },
    });
  };

  const onDragStartForExternalImage = (event: React.DragEvent<HTMLElement>) => {
    ui.startDrag(event, {
      type: "IMAGE",
      resolveImageRef: uploadExternalImage,
      previewUrl:
        "https://www.canva.dev/example-assets/image-import/grass-image-thumbnail.jpg",
      previewSize: {
        width: 320,
        height: 212,
      },
      fullSize: {
        width: 320,
        height: 212,
      },
    });
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
          This example demonstrates how apps can support drag-and-drop of
          images.
        </Text>
        <Rows spacing="1u">
          <Title size="small">Local image</Title>
          <Text size="small" tone="tertiary">
            This local image is made draggable via drag and drop and asset
            upload.
          </Text>
          <ImageCard
            ariaLabel="Add image to design"
            alt="dog image"
            thumbnailUrl={dog}
            onDragStart={onDragStartForLocalImage}
            onClick={insertLocalImage}
          />
        </Rows>
        <Rows spacing="1u">
          <Title size="small">External Image</Title>
          <Text size="small" tone="tertiary">
            This image is an external https image made draggable via drag and
            drop and asset upload.
          </Text>
          <ImageCard
            ariaLabel="Add image to design"
            alt="grass image"
            thumbnailUrl="https://www.canva.dev/example-assets/image-import/grass-image.jpg"
            onClick={insertExternalImage}
            onDragStart={onDragStartForExternalImage}
          />
        </Rows>
      </Rows>
    </div>
  );
};
