import * as React from "react";
import type {
  UserSuppliedExternalImageDragData,
  UserSuppliedDataUrlImageDragData,
  UserSuppliedImageDragData,
} from "@canva/design";
import { ui } from "@canva/design";

type DraggableExternalUrlProps = Partial<UserSuppliedExternalImageDragData> &
  Pick<UserSuppliedExternalImageDragData, "resolveImageRef"> &
  React.ImgHTMLAttributes<HTMLImageElement>;

type DraggableDataUrlProps = Partial<UserSuppliedDataUrlImageDragData> &
  React.ImgHTMLAttributes<HTMLImageElement> & {
    /**
     * @deprecated use the previewSize, previewSrc, fullSize, fullSizeSrc props instead
     */
    dragData?: Partial<UserSuppliedDataUrlImageDragData>;
  };

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
  props: React.ImgHTMLAttributes<HTMLImageElement>;
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

export const DraggableImage = (props: DraggableImageProps) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [canDrag, setCanDrag] = React.useState(false);
  const { data: dragData, props: imgProps } = getDragDataAndProps(props);
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

  return (
    <img
      {...imgProps}
      onLoad={makeDraggable}
      draggable={canDrag}
      style={{ cursor: "pointer", ...props.style, opacity }}
    />
  );
};
