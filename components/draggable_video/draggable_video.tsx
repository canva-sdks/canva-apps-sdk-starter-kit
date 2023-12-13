import * as React from "react";
import type {
  UserSuppliedVideoDragData,
  UserSuppliedDragData,
} from "@canva/design";
import { ui } from "@canva/design";
import type { VideoMimeType } from "@canva/asset";
import styles from "./draggable_video.css";

const SECONDS_IN_MINUTE = 60;
const DEFAULT_VIDEO_BADGE_LABEL = "VIDEO";

type PartialVideoDragData = Partial<UserSuppliedVideoDragData> &
  Pick<UserSuppliedVideoDragData, "resolveVideoRef">;

type ElementProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src" | "onClick"
> & {
  /**
   * The thumbnail to display in the object panel. For Gifs, this can just be the gif to upload.
   * Otherwise, this should be a poster frame from the video.
   */
  thumbnailImageSrc: string;
  /**
   * A playable preview of the video. This should be short (less than 10 seconds).
   * If uploading a gif, this should be omitted and the gif should be put as the thumbnailImageSrc instead.
   */
  thumbnailVideoSrc?: string;
  /**
   * The duration of the full video in seconds.
   */
  durationInSeconds?: number;
  /**
   * The mime-type of the video to be imported.
   */
  mimeType: VideoMimeType;
} & (
    | {
        /**
         * ClassNames for the button containing the video.
         * When an onClick is supplied, the video will be wrapped with a button.
         * Use this prop to adjust the styles of that button.
         */
        containerClassName?: string;
        /**
         * Handler for when a user clicks the video.
         * Ideally should be configured to insert the video via the design api.
         */
        onClick: (evt: React.MouseEvent<HTMLElement>) => void;
      }
    | { onClick?: never; containerClassName?: never }
  );

function getBadgeLabel(mimeType: VideoMimeType, duration?: number): string {
  if (mimeType === "image/gif") {
    return "GIF";
  }

  // If omitted defaults to 'video'
  if (!duration) {
    return DEFAULT_VIDEO_BADGE_LABEL;
  }

  // if less than 1 minute, display as seconds
  if (duration < SECONDS_IN_MINUTE) {
    return `${duration.toFixed(1)}s`;
  }

  // If over 1 minute, display as MM:SS
  return `${Math.floor(duration / SECONDS_IN_MINUTE)}:${(
    duration % SECONDS_IN_MINUTE
  )
    .toString()
    .padStart(2, "0")}`;
}

type DraggableVideoProps = PartialVideoDragData & ElementProps;

const getDragDataAndProps = (
  props: DraggableVideoProps
): {
  data: PartialVideoDragData & Pick<UserSuppliedVideoDragData, "type">;
  props: ElementProps;
} => {
  const {
    fullSize,
    previewSize,
    resolveVideoRef,
    previewSrc,
    ...elementProps
  } = props;
  const rawDragData: PartialVideoDragData = {
    fullSize,
    previewSize,
    resolveVideoRef,
    previewSrc: props.previewSrc || elementProps.thumbnailImageSrc,
    type: "VIDEO",
  };

  return {
    data: Object.keys(rawDragData).reduce(
      (data, key) =>
        rawDragData[key] ? { ...data, [key]: rawDragData[key] } : data,
      {} as PartialVideoDragData & Pick<UserSuppliedVideoDragData, "type">
    ),
    props: elementProps,
  };
};

/**
 * @deprecated use `VideoCard` from `@canva/app-ui-kit` instead.
 */
export const DraggableVideo = (props: DraggableVideoProps) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [showVideo, setShowVideo] = React.useState(false);
  const [canDrag, setCanDrag] = React.useState(false);
  const {
    data: dragData,
    props: {
      thumbnailImageSrc,
      thumbnailVideoSrc,
      durationInSeconds,
      mimeType,
      onClick,
      ...imgProps
    },
  } = getDragDataAndProps(props);
  const opacity = isDragging ? 0 : props.style?.opacity || 1;

  const makeDraggable = (
    evt: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const img = evt.currentTarget.parentElement;
    if (!img) {
      return;
    }

    const _dragData: UserSuppliedDragData = {
      ...dragData,
      type: "VIDEO",
      resolveVideoRef: props.resolveVideoRef,
      previewSize: dragData.previewSize || {
        width: evt.currentTarget.clientWidth,
        height: evt.currentTarget.clientHeight,
      },
      previewSrc: dragData.previewSrc || props.thumbnailImageSrc,
    };

    try {
      ui.makeDraggable({
        node: img,
        dragData: _dragData,
        onDragEnd: () => setIsDragging(false),
        onDragStart: () => setIsDragging(true),
      });
      setCanDrag(true);
      return imgProps.onLoad?.(evt);
    } catch (e) {
      console.error(e);
    }
  };

  const Content = (
    <>
      <img
        {...imgProps}
        src={thumbnailImageSrc}
        onLoad={makeDraggable}
        draggable={canDrag}
      />
      {showVideo && thumbnailVideoSrc && (
        <video
          autoPlay={true}
          controls={false}
          playsInline={true}
          muted={true}
          loop={true}
          src={thumbnailVideoSrc}
          width={imgProps.width}
          height={imgProps.height}
          className={styles.previewVideo}
        />
      )}
      <Badge className={styles.videoBadge}>
        {getBadgeLabel(props.mimeType, props.durationInSeconds)}
      </Badge>
    </>
  );

  if (onClick) {
    return (
      <button
        onMouseEnter={() => setShowVideo(true)}
        onMouseLeave={() => setShowVideo(false)}
        style={{ opacity }}
        onClick={onClick}
        className={styles.draggableVideoContainer}
      >
        {Content}
      </button>
    );
  }

  return (
    <div
      onMouseEnter={() => setShowVideo(true)}
      onMouseLeave={() => setShowVideo(false)}
      style={{ opacity }}
      className={styles.draggableVideoContainer}
    >
      {Content}
    </div>
  );
};

const Badge = ({
  children,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props} style={{ ...style }}>
    <div className={styles.badgeInner}>{children}</div>
  </div>
);
