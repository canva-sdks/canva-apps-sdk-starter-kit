/* eslint-disable no-console */
import { Alert, Button, Rows, Text } from "@canva/app-ui-kit";
import { upload } from "@canva/asset";
import { addAudioTrack } from "@canva/design";
import * as styles from "styles/components.css";
import { useAddElement } from "utils/use_add_element";
import { useFeatureSupport } from "utils/use_feature_support";

export const App = () => {
  const isSupported = useFeatureSupport();
  const addElement = useAddElement();

  const importAndAddImage = async () => {
    // Start uploading the image
    const image = await upload({
      type: "image",
      mimeType: "image/jpeg",
      url: "https://www.canva.dev/example-assets/image-import/image.jpg",
      thumbnailUrl:
        "https://www.canva.dev/example-assets/image-import/thumbnail.jpg",
      width: 540,
      height: 720,
      aiDisclosure: "none",
    });

    // Add the image to the design, using the thumbnail at first, and replacing
    // with the full image once the upload completes
    await addElement({
      type: "image",
      ref: image.ref,
      altText: {
        text: "a photo of buildings by the water",
        decorative: undefined,
      },
    });

    // Wait for the upload to finish so we can report errors if it fails to
    // upload
    await image.whenUploaded();

    // upload is completed
    console.log("Upload complete!");
  };

  const importAndAddVideo = async () => {
    // Start uploading the video
    const queuedVideo = await upload({
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

    // Add the video to the design, using the thumbnail at first, and replacing
    // with the full image once the upload completes
    await addElement({
      type: "video",
      ref: queuedVideo.ref,
      altText: {
        text: "a video of building with yellow spinning wheel",
        decorative: undefined,
      },
    });

    // Wait for the upload to finish so we can report errors if it fails to
    // upload
    await queuedVideo.whenUploaded();

    // upload is completed
    console.log("Upload complete!");
  };

  const importAndAddAudio = async () => {
    const queuedAudio = await upload({
      type: "audio",
      mimeType: "audio/mp3",
      url: "https://www.canva.dev/example-assets/audio-import/audio.mp3",
      durationMs: 86047,
      title: "Example audio",
      aiDisclosure: "none",
    });

    // Add the audio to the design as a new audio track
    await addAudioTrack({
      ref: queuedAudio.ref,
    });

    // Wait for the upload to finish so we can report errors if it fails to
    // upload
    await queuedAudio.whenUploaded();

    // upload is completed
    console.log("Upload complete!");
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
          This example demonstrates how apps can import video, audio and image
          assets into Canva.
        </Text>
        <Rows spacing="1.5u">
          <Button onClick={importAndAddImage} variant="secondary" stretch>
            Import image
          </Button>
          <Button onClick={importAndAddVideo} variant="secondary" stretch>
            Import video
          </Button>
          <Button
            onClick={importAndAddAudio}
            variant="secondary"
            // addAudioTrack is not supported in certain design types such as docs.
            disabled={!isSupported(addAudioTrack)}
            stretch
          >
            Import audio
          </Button>
        </Rows>
        {!isSupported(addAudioTrack) && <UnsupportedAlert />}
      </Rows>
    </div>
  );
};

const UnsupportedAlert = () => (
  <Alert tone="warn">
    Sorry, the required feature - addAudioTrack is not supported in the current
    design.
  </Alert>
);
