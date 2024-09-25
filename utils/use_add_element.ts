import type {
  EmbedElement,
  ImageElement,
  RichtextElement,
  TableElement,
  TextElement,
  VideoElement,
} from "@canva/design";
import { addElementAtCursor, addElementAtPoint } from "@canva/design";
import { useFeatureSupport } from "./use_feature_support";
import { features } from "@canva/platform";
import { useEffect, useState } from "react";

type AddElementParams =
  | ImageElement
  | VideoElement
  | EmbedElement
  | TextElement
  | RichtextElement
  | TableElement;

export const useAddElement = () => {
  const isSupported = useFeatureSupport();

  // Store a wrapped addElement function that checks feature support
  const [addElement, setAddElement] = useState(() => {
    return (element: AddElementParams) => {
      if (features.isSupported(addElementAtPoint)) {
        return addElementAtPoint(element);
      } else if (features.isSupported(addElementAtCursor)) {
        return addElementAtCursor(element);
      }
    };
  });

  useEffect(() => {
    const addElement = (element: AddElementParams) => {
      if (isSupported(addElementAtPoint)) {
        return addElementAtPoint(element);
      } else if (isSupported(addElementAtCursor)) {
        return addElementAtCursor(element);
      }
    };
    setAddElement(() => addElement);
  }, [isSupported]);

  return addElement;
};
