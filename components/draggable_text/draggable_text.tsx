import type { DraggableElementData } from "@canva/design";
import * as React from "react";
import styles from "styles/components.css";
import { ui } from "@canva/design";

type DragProps = Omit<
  DraggableElementData["dragData"] & { type: "TEXT" },
  "type" | "children"
>;

export type DraggableTextProps = React.HTMLAttributes<HTMLElement> & DragProps;

export const DraggableText = (props: DraggableTextProps) => {
  const [node, setNode] = React.useState<HTMLElement | null>();
  const [isDragging, setIsDragging] = React.useState(false);
  const [canDrag, setCanDrag] = React.useState(false);
  const {
    decoration,
    textAlign,
    fontWeight,
    fontStyle,
    children,
    ...nodeProps
  } = props;

  React.useEffect(() => {
    if (!node) {
      return;
    }

    try {
      const elemData: DraggableElementData = {
        node,
        dragData: {
          type: "TEXT",
          decoration,
          fontWeight,
          fontStyle,
          textAlign,
        },
        onDragEnd: () => setIsDragging(false),
        onDragStart: () => setIsDragging(true),
      };
      ui.makeDraggable(elemData);
      setCanDrag(true);
    } catch (e) {
      console.error(e);
    }
  }, [node]);

  const opacity = isDragging ? 0 : props.style?.opacity || 1;

  const style = {
    fontStyle,
    fontWeight,
    textAlign,
    textDecorationLine: decoration,
    ...props.style,
    opacity,
  };

  return (
    <div style={style}>
      <p
        {...nodeProps}
        draggable={canDrag}
        className={styles.draggable}
        ref={setNode}
      >
        {children}
      </p>
    </div>
  );
};
