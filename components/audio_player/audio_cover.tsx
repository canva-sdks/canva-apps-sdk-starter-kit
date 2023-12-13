import {
  AlertTriangleIcon,
  MusicIcon,
  PauseIcon,
  PlayFilledIcon,
} from "@canva/app-ui-kit";
import clsx from "clsx";
import * as React from "react";
import { AudioContext } from "./audio_context";
import styles from "./audio_cover.css";

type AudioCoverProps = {
  /*
   * The audio to play when the user clicks the play button
   */
  url: string;
  /*
   * The cover art image to display. If omitted, a music not icon will be shown instead.
   */
  coverArtUrl?: string;
  /*
   * A boolean which determines if the parent container is being hovered over.
   */
  isHovering?: boolean;
};

function PlayingCircle({ duration }: { duration: number }) {
  return (
    <svg viewBox="0 0 56 56" className={styles.playingCircle}>
      <circle
        className={styles.animatedCircle}
        style={{ animationDuration: `${new Number(duration)}s` }}
        cx="28"
        cy="28"
        r="27"
      />
    </svg>
  );
}

/**
 * @deprecated use `AudioCard` from `@canva/app-ui-kit` instead
 */
export function AudioCover({
  isHovering = false,
  url,
  coverArtUrl,
}: AudioCoverProps) {
  const audioContext = React.useContext(AudioContext);
  if (audioContext == null) {
    throw new Error("AudioCover must be used under the AudioContextProvider");
  }

  const audio = React.useRef<HTMLAudioElement>();
  const [duration, setDuration] = React.useState(0);
  const [canPlay, setCanPlay] = React.useState(true);

  const isPlaying =
    audio.current && audio.current === audioContext.playingAudio;

  // This detects a URL change and stops the playing audio
  React.useEffect(() => {
    if (isPlaying) {
      audioContext.stopPlaying();
    }
    audio.current = new Audio(url);
    setCanPlay(true);
    audio.current.onerror = () => {
      if (audio.current?.src === url) {
        setDuration(0);
        setCanPlay(false);
      }
    };
    audio.current.onloadedmetadata = () => {
      if (duration === 0 && audio.current && audio.current.src === url) {
        setDuration(audio.current.duration);
      }
    };
  }, [url]);

  const playAudio = () => {
    if (!audio.current || !canPlay) {
      return;
    }
    audioContext.playAudio(audio.current);
  };

  const toggleAudio = (evt?: React.MouseEvent) => {
    evt?.stopPropagation();
    isPlaying ? audioContext.stopPlaying() : playAudio();
  };

  return (
    <div className={styles.draggableAudioCoverContainer}>
      {isPlaying && duration > 0 && <PlayingCircle duration={duration} />}
      <button
        className={clsx(
          styles.draggableAudioCover,
          isPlaying && styles.draggableAudioCoverPlaying
        )}
        onClick={toggleAudio}
      >
        {coverArtUrl && (
          <img
            draggable={false}
            src={coverArtUrl}
            className={clsx(
              styles.draggableAudioImage,
              isPlaying && styles.draggableAudioImagePlaying
            )}
          />
        )}
        <span className={styles.audioIconContainer}>
          <AudioIcon
            canPlay={canPlay}
            isPlaying={!!isPlaying}
            hasCoverArt={coverArtUrl != null}
            isHovering={isHovering}
          />
        </span>
      </button>
    </div>
  );
}

const AudioIcon = ({
  canPlay,
  isPlaying,
  isHovering,
  hasCoverArt,
}: React.SVGProps<SVGElement> & {
  canPlay: boolean;
  isPlaying: boolean;
  isHovering: boolean;
  hasCoverArt: boolean;
}) => {
  if (!canPlay) {
    return <AlertTriangleIcon />;
  }

  if (isPlaying) {
    return <PauseIcon />;
  }

  if (isHovering) {
    return <PlayFilledIcon />;
  }

  if (!hasCoverArt) {
    return <MusicIcon />;
  }

  return null;
};
