import * as React from "react";
import clsx from "clsx";
import type {
  UserSuppliedExternalImageDragData,
  UserSuppliedDataUrlImageDragData,
  UserSuppliedImageDragData,
} from "@canva/design";
import { ui } from "@canva/design";
import styles from "./draggable_image.css";

type ClickableImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "onClick"
> & {
  /**
   * @deprecated use the previewSize, previewSrc, fullSize, fullSizeSrc props instead
   */
  dragData?: Partial<UserSuppliedDataUrlImageDragData>;
} & {
  /**
   * ClassNames for the button containing the image.
   * When an onClick is supplied, the image will be wrapped with a button.
   * Use this prop to adjust the styles of that button.
   */
  containerClassName?: string;
  /**
   * Handler for when a user clicks the image.
   * Ideally should be configured to insert the image via the design api.
   */
  onClick: (evt: React.MouseEvent<HTMLElement>) => void;
};

type StaticImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "onClick"
> & {
  /**
   * @deprecated use the previewSize, previewSrc, fullSize, fullSizeSrc props instead
   */
  dragData?: Partial<UserSuppliedDataUrlImageDragData>;
} & { onClick?: never; containerClassName?: never };

type ImageProps = ClickableImageProps | StaticImageProps;

type DraggableExternalUrlProps = Partial<UserSuppliedExternalImageDragData> &
  Pick<UserSuppliedExternalImageDragData, "resolveImageRef"> &
  ImageProps;

type DraggableDataUrlProps = Partial<UserSuppliedDataUrlImageDragData> &
  ImageProps;

export type DraggableImageProps =
  | DraggableDataUrlProps
  | DraggableExternalUrlProps;

function isExternalProps(
  props: DraggableImageProps
): props is DraggableExternalUrlProps {
  return (props as DraggableExternalUrlProps).resolveImageRef != null;
}

const getDragDataAndProps = (
  props: DraggableImageProps
): {
  data: Partial<UserSuppliedImageDragData>;
  props: ImageProps;
} => {
  if (isExternalProps(props)) {
    const { fullSize, previewSize, resolveImageRef, previewSrc, ...imgProps } =
      props;
    const rawDragData = {
      fullSize: props.fullSize,
      previewSize: props.previewSize,
      resolveImageRef: props.resolveImageRef,
      previewSrc: props.previewSrc,
      type: "IMAGE",
    };

    return {
      data: Object.keys(rawDragData).reduce(
        (data, key) =>
          rawDragData[key] ? { ...data, [key]: rawDragData[key] } : data,
        {}
      ),
      props: imgProps,
    };
  } else {
    const {
      dragData: _dragData,
      previewSize,
      previewSrc,
      fullSize,
      fullSizeSrc,
      ...imgProps
    } = props;

    const dragData = {
      ..._dragData,
      previewSize,
      previewSrc,
      fullSize,
      fullSizeSrc,
    };

    return {
      data: Object.keys(dragData).reduce(
        (data, key) =>
          dragData[key] ? { ...data, [key]: dragData[key] } : data,
        {} as Partial<DraggableDataUrlProps>
      ),
      props: imgProps,
    };
  }
};

/**
 * @deprecated use `ImageCard` from `@canva/app-ui-kit` instead.
 */
export const DraggableImage = (props: DraggableImageProps) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [canDrag, setCanDrag] = React.useState(false);
  const {
    data: dragData,
    props: { onClick, containerClassName, ...imgProps },
  } = getDragDataAndProps(props);
  const opacity = isDragging ? 0 : props.style?.opacity || 1;

  const makeDraggable = (
    evt: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const img = evt.currentTarget;
    if (!img) {
      return;
    }

    try {
      ui.makeDraggable({
        node: img,
        dragData,
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
    <img
      {...imgProps}
      onLoad={makeDraggable}
      draggable={canDrag}
      style={{ ...imgProps.style, opacity }}
    />
  );

  if (onClick) {
    return (
      <button
        className={clsx(styles.draggableButton, containerClassName)}
        style={{ opacity }}
        onClick={onClick}
      >
        {Content}
      </button>
    );
  }

  return Content;
};
