import React from "react";
import { Rows, Text, Title, ImageCard } from "@canva/app-ui-kit";
import { upload } from "@canva/asset";
import type { ImageDragConfig } from "@canva/design";
import { ui } from "@canva/design";
import dog from "assets/images/dog.jpg";
import * as styles from "styles/components.css";
import { useFeatureSupport } from "utils/use_feature_support";
import { useAddElement } from "utils/use_add_element";

const uploadExternalImage = () => {
  return upload({
    mimeType: "image/jpeg",
    thumbnailUrl:
      "https://www.canva.dev/example-assets/image-import/grass-image-thumbnail.jpg",
    type: "image",
    url: "https://www.canva.dev/example-assets/image-import/grass-image.jpg",
    width: 320,
    height: 212,
    aiDisclosure: "none",
  });
};

const uploadLocalImage = () => {
  return upload({
    mimeType: "image/jpeg",
    thumbnailUrl: dog,
    type: "image",
    url: dog,
    width: 100,
    height: 100,
    aiDisclosure: "none",
  });
};

const altText = {
  text: "grass image",
  decorative: true,
};

export const App = () => {
  const isSupported = useFeatureSupport();
  const addElement = useAddElement();

  const insertLocalImage = async () => {
    const { ref } = await uploadLocalImage();
    await addElement({ type: "image", ref, altText });
  };

  const insertExternalImage = async () => {
    const { ref } = await uploadExternalImage();
    addElement({ type: "image", ref, altText });
  };

  const onDragStartForLocalImage = (event: React.DragEvent<HTMLElement>) => {
    const dragData: ImageDragConfig = {
      type: "image",
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
    };
    if (isSupported(ui.startDragToPoint)) {
      ui.startDragToPoint(event, dragData);
    } else if (isSupported(ui.startDragToCursor)) {
      ui.startDragToCursor(event, dragData);
    }
  };

  const onDragStartForExternalImage = (event: React.DragEvent<HTMLElement>) => {
    const dragData: ImageDragConfig = {
      type: "image",
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
    };

    if (isSupported(ui.startDragToPoint)) {
      ui.startDragToPoint(event, dragData);
    } else if (isSupported(ui.startDragToCursor)) {
      ui.startDragToCursor(event, dragData);
    }
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
