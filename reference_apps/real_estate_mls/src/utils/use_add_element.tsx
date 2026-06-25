import { useFeatureSupport } from "@canva/app-hooks";
import { type ImageMimeType, upload } from "@canva/asset";
import { addElementAtCursor, addElementAtPoint } from "@canva/design";
import type { ImageElement, TextElement } from "@canva/design";

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

export const useAddElement = () => {
  const isSupported = useFeatureSupport();
  const addElement = [addElementAtPoint, addElementAtCursor].find((fn) =>
    isSupported(fn),
  );

  const addText = (text?: string) => {
    const textElement: TextElement = {
      type: "text",
      children: [text || ""],
    };

    addElement?.(textElement);
  };

  const addImage = async (imageUrl: string, altText: string) => {
    const mimeType = getMimeTypeFromUrl(imageUrl);
    const image = await upload({
      mimeType,
      thumbnailUrl: imageUrl,
      type: "image",
      url: imageUrl,
      aiDisclosure: "none",
    });

    const imageElement: ImageElement = {
      type: "image",
      altText: {
        text: altText,
        decorative: true,
      },
      ref: image.ref,
    };

    addElement?.(imageElement);
  };

  return {
    addText,
    addImage,
  };
};
