import type { DraggableElementData } from "@canva/design";
import { ui } from "@canva/design";
import clsx from "clsx";
import * as React from "react";
import styles from "./draggable_text.css";

type DragProps = Omit<
  DraggableElementData["dragData"] & { type: "TEXT" },
  "type" | "children"
>;

export type DraggableTextProps = React.HTMLAttributes<HTMLElement> &
  DragProps &
  (
    | {
        /**
         * ClassNames for the button containing the text.
         * When an onClick is supplied, the text will be wrapped with a button.
         * Use this prop to adjust the styles of that button.
         */
        containerClassName?: string;
        /**
         * Handler for when a user clicks the text.
         * Ideally should be configured to insert the image via the design api.
         */
        onClick: (evt: React.MouseEvent<HTMLElement>) => void;
      }
    | { containerClassName?: never; onClick?: never }
  );

/**
 * @deprecated use `TypographCard` from `@canva/app-ui-kit` instead.
 */
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
    onClick,
    containerClassName,
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

  const Content = (
    <p
      {...nodeProps}
      draggable={canDrag}
      className={styles.draggable}
      ref={setNode}
    >
      {children}
    </p>
  );

  if (onClick) {
    return (
      <button
        style={style}
        onClick={onClick}
        className={clsx(styles.draggableButton, containerClassName)}
      >
        {Content}
      </button>
    );
  }

  return <div style={style}>{Content}</div>;
};
