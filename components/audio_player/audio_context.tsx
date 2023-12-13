import * as React from "react";

export type AudioContextValue = {
  playingAudio?: HTMLAudioElement;
  isDefault: false;
  playAudio: (audio: HTMLAudioElement) => void;
  stopPlaying: () => void;
};

export const AudioContext = React.createContext<AudioContextValue | undefined>(
  undefined
);

/**
 *  @deprecated use `AudioContextProvider` along with `AudioCard` from `@canva/app-ui-kit` instead.
 *  This provider is used to track the currently playing audio track
 *  By using this, we can ensure only 1 audio track is playing at a time.
 *  It also manages the situation where a user tries to play an audio file while another is playing.
 */
export const AudioContextProvider = (props: React.PropsWithChildren<{}>) => {
  const [playingAudio, setPlayingAudio] = React.useState<
    HTMLAudioElement | undefined
  >();
  const previousAudio = React.useRef(playingAudio);

  React.useEffect(() => {
    if (previousAudio.current && previousAudio.current !== playingAudio) {
      previousAudio.current.pause();
      previousAudio.current.onended = null;
    }
    previousAudio.current = playingAudio;
  });

  const stopPlaying = () => {
    if (playingAudio) {
      playingAudio?.pause();
      playingAudio.onended = null;
    }
    setPlayingAudio(undefined);
  };

  const playAudio = (audio: HTMLAudioElement) => {
    audio.currentTime = 0;
    audio.play();
    audio.onended = stopPlaying;
    setPlayingAudio(audio);
  };

  return (
    <AudioContext.Provider
      {...props}
      value={{
        playingAudio,
        isDefault: false,
        stopPlaying,
        playAudio,
      }}
    />
  );
};
