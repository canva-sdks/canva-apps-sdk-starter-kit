import { Rows, Text, Title, VideoCard } from "@canva/app-ui-kit";
import { upload } from "@canva/asset";
import { VideoDragConfig, addNativeElement, ui } from "@canva/design";
import React from "react";
import styles from "styles/components.css";

const uploadVideo = () => {
  return upload({
    mimeType: "video/mp4",
    thumbnailImageUrl:
      "https://www.canva.dev/example-assets/video-import/beach-thumbnail-image.jpg",
    thumbnailVideoUrl:
      "https://www.canva.dev/example-assets/video-import/beach-thumbnail-video.mp4",
    type: "VIDEO",
    url: "https://www.canva.dev/example-assets/video-import/beach-video.mp4",
    width: 320,
    height: 180,
  });
};

const insertVideo = async () => {
  const { ref } = await uploadVideo();
  return addNativeElement({ type: "VIDEO", ref });
};

const onDragStart = (event: React.DragEvent<HTMLElement>) => {
  const dragData: VideoDragConfig = {
    type: "VIDEO",
    resolveVideoRef: uploadVideo,
    previewSize: {
      width: 320,
      height: 180,
    },
    previewUrl:
      "https://www.canva.dev/example-assets/video-import/beach-thumbnail-image.jpg",
  };
  ui.startDrag(event, dragData);
};

export const App = () => {
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
