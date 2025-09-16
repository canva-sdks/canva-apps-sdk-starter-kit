// For usage information, see the README.md file.
import React from "react";
import { Rows, Text, Title, VideoCard } from "@canva/app-ui-kit";
import { upload } from "@canva/asset";
import type { VideoDragConfig } from "@canva/design";
import { ui } from "@canva/design";
import * as styles from "styles/components.css";
import { useFeatureSupport } from "utils/use_feature_support";
import { useAddElement } from "utils/use_add_element";

// Uploads a video asset to Canva using the upload API
const uploadVideo = () => {
  return upload({
    mimeType: "video/mp4",
    // Thumbnail image shown when video is not playing
    thumbnailImageUrl:
      "https://www.canva.dev/example-assets/video-import/beach-thumbnail-image.jpg",
    // Preview video for hover states and drag operations
    thumbnailVideoUrl:
      "https://www.canva.dev/example-assets/video-import/beach-thumbnail-video.mp4",
    type: "video",
    url: "https://www.canva.dev/example-assets/video-import/beach-video.mp4",
    width: 320,
    height: 180,
    // AI disclosure indicates if content was AI-generated
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

  // Configuration for drag-and-drop behavior in Canva
  const dragData: VideoDragConfig = {
    type: "video",
    // Function that handles video upload when drag is completed
    resolveVideoRef: uploadVideo,
    // Size of the preview during drag operation
    previewSize: {
      width: 320,
      height: 180,
    },
    // Image shown during drag preview
    previewUrl:
      "https://www.canva.dev/example-assets/video-import/beach-thumbnail-image.jpg",
  };

  // Handles drag start with feature detection for drag API compatibility
  const onDragStart = (event: React.DragEvent<HTMLElement>) => {
    // Prefer startDragToPoint for better UX (drag follows cursor to specific point)
    if (isSupported(ui.startDragToPoint)) {
      ui.startDragToPoint(event, dragData);
    } else if (isSupported(ui.startDragToCursor)) {
      // Fallback to startDragToCursor (drag follows cursor movement)
      ui.startDragToCursor(event, dragData);
    }
  };

  // Alternative method to add video directly without drag-and-drop
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
          <Title size="small">External video</Title>
          <Text size="small" tone="tertiary">
            This video is an external HTTPS video made draggable via drag and
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
