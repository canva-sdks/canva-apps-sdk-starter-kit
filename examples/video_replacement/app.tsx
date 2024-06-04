import React from "react";
import { Button, Rows, Text } from "@canva/app-ui-kit";
import styles from "styles/components.css";
import { upload } from "@canva/asset";
import { useSelection } from "utils/use_selection_hook";

export const App = () => {
  const [loading, setLoading] = React.useState(false);
  const selection = useSelection("video");

  const updateVideo = async () => {
    setLoading(true);
    const queuedVideo = await upload({
      type: "VIDEO",
      mimeType: "video/mp4",
      thumbnailImageUrl:
        "https://www.canva.dev/example-assets/video-import/beach-thumbnail-image.jpg",
      thumbnailVideoUrl:
        "https://www.canva.dev/example-assets/video-import/beach-thumbnail-video.mp4",
      url: "https://www.canva.dev/example-assets/video-import/beach-video.mp4",
      width: 320,
      height: 180,
    });
    const draft = await selection.read();
    draft.contents.forEach((s) => (s.ref = queuedVideo.ref));

    await draft.save();
    setLoading(false);
  };
  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can replace the selected video.
          Select a video in the editor to begin.
        </Text>
        <Button
          variant="primary"
          onClick={updateVideo}
          disabled={selection.count === 0}
          loading={loading}
        >
          Replace with sample video
        </Button>
      </Rows>
    </div>
  );
};
