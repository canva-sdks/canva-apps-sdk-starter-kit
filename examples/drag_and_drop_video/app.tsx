import { Rows, Text, Title } from "@canva/app-ui-kit";
import { upload } from "@canva/asset";
import { DraggableVideo } from "components/draggable_video";
import React from "react";
import styles from "styles/components.css";

const uploadVideo = async () => {
  const video = await upload({
    // An alphanumeric string that is unique for each asset. If given the same
    // id, the existing asset for that id will be used instead.
    id: "uniqueBeachVideoIdentifier",
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

  return video;
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
          <DraggableVideo
            width={320}
            height={180}
            thumbnailImageSrc="https://www.canva.dev/example-assets/video-import/beach-thumbnail-image.jpg"
            thumbnailVideoSrc="https://www.canva.dev/example-assets/video-import/beach-thumbnail-video.mp4"
            durationInSeconds={7}
            resolveVideoRef={uploadVideo}
            mimeType="video/mp4"
          />
        </Rows>
      </Rows>
    </div>
  );
};
