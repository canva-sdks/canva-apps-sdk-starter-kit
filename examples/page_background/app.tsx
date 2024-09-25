import { upload } from "@canva/asset";
import { Alert, Button, Rows, Text } from "@canva/app-ui-kit";
import { setCurrentPageBackground } from "@canva/design";
import * as styles from "styles/components.css";
import { useState } from "react";
import { useFeatureSupport } from "utils/use_feature_support";

export const App = () => {
  const [loading, setLoading] = useState(false);
  const isSupported = useFeatureSupport();
  const isRequiredFeatureSupported = isSupported(setCurrentPageBackground);

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
      type: "image",
      mimeType: "image/jpeg",
      url: "https://www.canva.dev/example-assets/image-import/image.jpg",
      thumbnailUrl:
        "https://www.canva.dev/example-assets/image-import/thumbnail.jpg",
      width: 540,
      height: 720,
      aiDisclosure: "none",
    });
    await setCurrentPageBackground({
      asset: { type: "image", ref },
    });
    setLoading(false);
  };

  const setBackgroundVideo = async () => {
    setLoading(true);
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
          Set Background to a Solid Color
        </Button>
        <Button
          stretch
          variant="secondary"
          loading={loading}
          // Set page background is not supported in certain design type such as docs.
          disabled={loading || !isRequiredFeatureSupported}
          onClick={setBackgroundImage}
        >
          Set Background to an Image
        </Button>
        <Button
          stretch
          variant="secondary"
          loading={loading}
          // Set page background is not supported in certain design type such as docs.
          disabled={loading || !isRequiredFeatureSupported}
          onClick={setBackgroundVideo}
        >
          Set Background to a Video
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
