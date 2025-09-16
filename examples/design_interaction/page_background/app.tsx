// For usage information, see the README.md file.
import { upload } from "@canva/asset";
import { Alert, Button, Rows, Text } from "@canva/app-ui-kit";
import { setCurrentPageBackground } from "@canva/design";
import * as styles from "styles/components.css";
import { useState } from "react";
import { useFeatureSupport } from "utils/use_feature_support";

export const App = () => {
  const [loading, setLoading] = useState(false);

  // Check if the current design type supports page background changes
  // (Some design types like docs don't support background modification)
  const isSupported = useFeatureSupport();
  const isRequiredFeatureSupported = isSupported(setCurrentPageBackground);

  const setBackgroundToSolidColor = async () => {
    setLoading(true);
    // Set the page background to a solid color using hex color value
    await setCurrentPageBackground({
      color: "#ff0099",
    });
    setLoading(false);
  };

  const setBackgroundImage = async () => {
    setLoading(true);

    // Upload an external image asset to Canva for use as background
    // The upload function returns a reference that can be used with Canva APIs
    const { ref } = await upload({
      type: "image",
      mimeType: "image/jpeg",
      url: "https://www.canva.dev/example-assets/image-import/image.jpg",
      thumbnailUrl:
        "https://www.canva.dev/example-assets/image-import/thumbnail.jpg",
      width: 540,
      height: 720,
      aiDisclosure: "none",
    });

    // Apply the uploaded image as the page background
    await setCurrentPageBackground({
      asset: { type: "image", ref },
    });
    setLoading(false);
  };

  const setBackgroundVideo = async () => {
    setLoading(true);

    // Upload an external video asset to Canva for use as background
    // Videos require both image and video thumbnails for preview
    const { ref } = await upload({
      type: "video",
      mimeType: "video/mp4",
      url: "https://www.canva.dev/example-assets/video-import/video.mp4",
      thumbnailImageUrl:
        "https://www.canva.dev/example-assets/video-import/thumbnail-image.jpg",
      thumbnailVideoUrl:
        "https://www.canva.dev/example-assets/video-import/thumbnail-video.mp4",
      width: 405,
      height: 720,
      aiDisclosure: "none",
    });

    // Apply the uploaded video as the page background
    await setCurrentPageBackground({
      asset: { type: "video", ref },
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
          // Set page background is not supported in certain design type such as docs.
          disabled={loading || !isRequiredFeatureSupported}
          variant="secondary"
          onClick={setBackgroundToSolidColor}
        >
          Set background to a solid color
        </Button>
        <Button
          stretch
          variant="secondary"
          loading={loading}
          // Set page background is not supported in certain design type such as docs.
          disabled={loading || !isRequiredFeatureSupported}
          onClick={setBackgroundImage}
        >
          Set background to an image
        </Button>
        <Button
          stretch
          variant="secondary"
          loading={loading}
          // Set page background is not supported in certain design type such as docs.
          disabled={loading || !isRequiredFeatureSupported}
          onClick={setBackgroundVideo}
        >
          Set background to a video
        </Button>
        {!isRequiredFeatureSupported && <UnsupportedAlert />}
      </Rows>
    </div>
  );
};

const UnsupportedAlert = () => (
  <Alert tone="warn">
    Sorry, the required features are not supported in the current design.
  </Alert>
);
