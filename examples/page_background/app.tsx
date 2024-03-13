import * as React from "react";
import { upload } from "@canva/asset";
import { Button, Rows, Text } from "@canva/app-ui-kit";
import { setCurrentPageBackground } from "@canva/design";
import styles from "styles/components.css";

export const App = () => {
  const [loading, setLoading] = React.useState(false);

  const setBackgroundToSolidColor = async () => {
    setLoading(true);
    await setCurrentPageBackground({
      color: "#ff0099",
    });
    setLoading(false);
  };

  const setBackgroundImage = async () => {
    setLoading(true);
    const { ref } = await upload({
      type: "IMAGE",
      mimeType: "image/jpeg",
      url: "https://www.canva.dev/example-assets/image-import/image.jpg",
      thumbnailUrl:
        "https://www.canva.dev/example-assets/image-import/thumbnail.jpg",
      width: 540,
      height: 720,
    });
    await setCurrentPageBackground({
      asset: { type: "IMAGE", ref },
    });
    setLoading(false);
  };

  const setBackgroundVideo = async () => {
    setLoading(true);
    const { ref } = await upload({
      type: "VIDEO",
      mimeType: "video/mp4",
      url: "https://www.canva.dev/example-assets/video-import/video.mp4",
      thumbnailImageUrl:
        "https://www.canva.dev/example-assets/video-import/thumbnail-image.jpg",
      thumbnailVideoUrl:
        "https://www.canva.dev/example-assets/video-import/thumbnail-video.mp4",
      width: 405,
      height: 720,
    });
    await setCurrentPageBackground({
      asset: { type: "VIDEO", ref },
    });
    setLoading(false);
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can set the background of the
          current page.
        </Text>
        <Button
          stretch
          loading={loading}
          disabled={loading}
          variant="secondary"
          onClick={setBackgroundToSolidColor}
        >
          Set Background to a Solid Color
        </Button>
        <Button
          stretch
          variant="secondary"
          loading={loading}
          disabled={loading}
          onClick={setBackgroundImage}
        >
          Set Background to an Image
        </Button>
        <Button
          stretch
          variant="secondary"
          loading={loading}
          disabled={loading}
          onClick={setBackgroundVideo}
        >
          Set Background to a Video
        </Button>
      </Rows>
    </div>
  );
};
