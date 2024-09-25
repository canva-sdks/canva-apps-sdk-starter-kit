import React from "react";
import { Rows, Text, Title, VideoCard } from "@canva/app-ui-kit";
import { upload } from "@canva/asset";
import type { VideoDragConfig } from "@canva/design";
import { ui } from "@canva/design";
import * as styles from "styles/components.css";
import { useFeatureSupport } from "utils/use_feature_support";
import { useAddElement } from "utils/use_add_element";

const uploadVideo = () => {
  return upload({
    mimeType: "video/mp4",
    thumbnailImageUrl:
      "https://www.canva.dev/example-assets/video-import/beach-thumbnail-image.jpg",
    thumbnailVideoUrl:
      "https://www.canva.dev/example-assets/video-import/beach-thumbnail-video.mp4",
    type: "video",
    url: "https://www.canva.dev/example-assets/video-import/beach-video.mp4",
    width: 320,
    height: 180,
    aiDisclosure: "none",
  });
};

const altText = {
  text: "beach video",
  decorative: true,
};

export const App = () => {
  const isSupported = useFeatureSupport();
  const addElement = useAddElement();

  const dragData: VideoDragConfig = {
    type: "video",
    resolveVideoRef: uploadVideo,
    previewSize: {
      width: 320,
      height: 180,
    },
    previewUrl:
      "https://www.canva.dev/example-assets/video-import/beach-thumbnail-image.jpg",
  };

  const onDragStart = (event: React.DragEvent<HTMLElement>) => {
    if (isSupported(ui.startDragToPoint)) {
      ui.startDragToPoint(event, dragData);
    } else if (isSupported(ui.startDragToCursor)) {
      ui.startDragToCursor(event, dragData);
    }
  };

  const insertVideo = async () => {
    const { ref } = await uploadVideo();
    addElement({ type: "video", ref, altText });
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
          This example demonstrates how apps can support drag-and-drop of
          videos.
        </Text>
        <Rows spacing="1u">
          <Title size="small">External Video</Title>
          <Text size="small" tone="tertiary">
            This video is an external https video made draggable via drag and
            drop and asset upload.
          </Text>
          <VideoCard
            ariaLabel="Add video to design"
            thumbnailUrl="https://www.canva.dev/example-assets/video-import/beach-thumbnail-image.jpg"
            videoPreviewUrl="https://www.canva.dev/example-assets/video-import/beach-thumbnail-video.mp4"
            durationInSeconds={7}
            mimeType="video/mp4"
            onDragStart={onDragStart}
            onClick={insertVideo}
          />
        </Rows>
      </Rows>
    </div>
  );
};
