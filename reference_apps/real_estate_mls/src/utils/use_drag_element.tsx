import { useFeatureSupport } from "@canva/app-hooks";
import { type ImageMimeType, upload } from "@canva/asset";
import { ui } from "@canva/design";
import type { DragStartEvent } from "@canva/design";
import type { DragEvent } from "react";

const getMimeTypeFromUrl = (url: string): ImageMimeType => {
  const extension = url.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "tiff":
      return "image/tiff";
    default:
      return "image/jpeg"; // fallback to jpeg
  }
};

export const useDragElement = () => {
  const isSupported = useFeatureSupport();
  const startDrag = [ui.startDragToPoint].find((fn) => isSupported(fn));

  const dragText = (event: DragEvent<Element>, text: string) => {
    startDrag?.(event as unknown as DragStartEvent<HTMLElement>, {
      type: "text",
      children: [text],
    });
  };

  const dragImage = (
    event: DragStartEvent<Element>,
    imageUrl: string,
    altText: string,
    width: number,
    height: number,
  ) => {
    const mimeType = getMimeTypeFromUrl(imageUrl);
    startDrag?.(event as unknown as DragStartEvent<HTMLElement>, {
      type: "image",
      resolveImageRef: () => {
        return upload({
          mimeType,
          thumbnailUrl: imageUrl,
          type: "image",
          url: imageUrl,
          aiDisclosure: "none",
        });
      },
      previewUrl: imageUrl,
      previewSize: {
        width,
        height,
      },
      fullSize: {
        width,
        height,
      },
    });
  };

  return {
    dragText,
    dragImage,
  };
};
