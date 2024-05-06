import React from "react";
import { Rows, Text, AudioCard, AudioContextProvider } from "@canva/app-ui-kit";
import { upload } from "@canva/asset";
import { addAudioTrack, ui } from "@canva/design";
import styles from "styles/components.css";

const AUDIO_DURATION_MS = 86_047;

const uploadAudio = () => {
  return upload({
    title: "MP3 Audio Track",
    durationMs: AUDIO_DURATION_MS,
    mimeType: "audio/mp3",
    type: "AUDIO",
    url: "https://www.canva.dev/example-assets/audio-import/audio.mp3",
  });
};

const insertAudio = async () => {
  const audio = await uploadAudio();
  addAudioTrack({
    ref: audio.ref,
  });
};

const onDragStart = (event: React.DragEvent<HTMLElement>) => {
  ui.startDrag(event, {
    type: "AUDIO",
    resolveAudioRef: uploadAudio,
    durationMs: AUDIO_DURATION_MS,
    title: "MP3 Audio Track",
  });
};

export const App = () => (
  <AudioContextProvider>
    <div className={styles.scrollContainer}>
      <Rows spacing="1u">
        <Text>
          This example demonstrates how apps can support drag-and-drop of audio.
        </Text>
        <AudioCard
          audioPreviewUrl="https://www.canva.dev/example-assets/audio-import/audio.mp3"
          durationInSeconds={AUDIO_DURATION_MS / 1000}
          ariaLabel="Add audio to design"
          title="MP3 Audio Track"
          onDragStart={onDragStart}
          onClick={insertAudio}
        />
      </Rows>
    </div>
  </AudioContextProvider>
);
