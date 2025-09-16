// For usage information, see the README.md file.
import React from "react";
import { Rows, Text, AudioCard, AudioContextProvider } from "@canva/app-ui-kit";
import { upload } from "@canva/asset";
import { addAudioTrack, ui } from "@canva/design";
import * as styles from "styles/components.css";
import { useFeatureSupport } from "utils/use_feature_support";

const AUDIO_DURATION_MS = 86_047;

// Uploads audio asset to Canva's asset library for use in designs
const uploadAudio = () => {
  return upload({
    title: "MP3 audio track",
    durationMs: AUDIO_DURATION_MS,
    mimeType: "audio/mp3",
    type: "audio",
    url: "https://www.canva.dev/example-assets/audio-import/audio.mp3",
    aiDisclosure: "none",
  });
};

const insertAudio = async () => {
  const audio = await uploadAudio();
  // Add the uploaded audio as an audio track to the current design
  addAudioTrack({
    ref: audio.ref,
  });
};

// Handles drag start event to initiate Canva's drag-and-drop functionality
const onDragStart = (event: React.DragEvent<HTMLElement>) => {
  // Start Canva's drag-to-point interaction for audio elements
  ui.startDragToPoint(event, {
    type: "audio",
    resolveAudioRef: uploadAudio, // Function to resolve audio reference when dropped
    durationMs: AUDIO_DURATION_MS,
    title: "MP3 audio track",
  });
};

export const App = () => {
  // Check if the required Canva APIs are supported in the current context
  const isSupported = useFeatureSupport();
  return (
    <AudioContextProvider>
      <div className={styles.scrollContainer}>
        <Rows spacing="1u">
          <Text>
            This example demonstrates how apps can support drag-and-drop of
            audio.
          </Text>
          <AudioCard
            audioPreviewUrl="https://www.canva.dev/example-assets/audio-import/audio.mp3"
            durationInSeconds={AUDIO_DURATION_MS / 1000}
            ariaLabel="Add audio to design"
            title="MP3 audio track"
            onDragStart={onDragStart}
            onClick={insertAudio}
            disabled={
              !isSupported(addAudioTrack) || !isSupported(ui.startDragToPoint)
            }
          />
        </Rows>
      </div>
    </AudioContextProvider>
  );
};
