// For usage information, see the README.md file.
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
    // Start uploading the image using Canva's upload API
    // This creates an asset reference that can be used immediately while the upload continues in the background
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

    // Add the image element to the current design using the asset reference
    // Canva will display the thumbnail initially and replace it with the full image once upload completes
    await addElement({
      type: "image",
      ref: image.ref,
      altText: {
        text: "a photo of buildings by the water",
        decorative: undefined,
      },
    });

    // Wait for the upload to complete to handle any upload errors
    // In production apps, this should include proper error handling and user feedback
    await image.whenUploaded();

    // Upload completed successfully
    console.log("Upload complete!");
  };

  const importAndAddVideo = async () => {
    // Start uploading the video using Canva's upload API
    // Videos support both image and video thumbnails for better preview experience
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

    // Add the video element to the current design using the asset reference
    // The video thumbnail will be shown initially, replaced with the full video once upload completes
    await addElement({
      type: "video",
      ref: queuedVideo.ref,
      altText: {
        text: "a video of building with yellow spinning wheel",
        decorative: undefined,
      },
    });

    // Wait for the upload to complete to handle any upload errors
    // In production apps, this should include proper error handling and user feedback
    await queuedVideo.whenUploaded();

    // Upload completed successfully
    console.log("Upload complete!");
  };

  const importAndAddAudio = async () => {
    // Start uploading the audio file using Canva's upload API
    // Audio uploads require duration metadata and optionally a title
    const queuedAudio = await upload({
      type: "audio",
      mimeType: "audio/mp3",
      url: "https://www.canva.dev/example-assets/audio-import/audio.mp3",
      durationMs: 86047,
      title: "Example audio",
      aiDisclosure: "none",
    });

    // Add the audio to the design as a new audio track (not supported in all design types)
    // Audio tracks are added to the timeline and play in the background of the design
    await addAudioTrack({
      ref: queuedAudio.ref,
    });

    // Wait for the upload to complete to handle any upload errors
    // In production apps, this should include proper error handling and user feedback
    await queuedAudio.whenUploaded();

    // Upload completed successfully
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
            // addAudioTrack is not supported in certain design types such as docs
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
    Sorry, the required feature (addAudioTrack) is not supported in the current
    design.
  </Alert>
);
