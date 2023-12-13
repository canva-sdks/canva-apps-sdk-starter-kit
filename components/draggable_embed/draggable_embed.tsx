import { Rows, Text, Title } from "@canva/app-ui-kit";
import { EmbedDragConfig, ui } from "@canva/design";
import React from "react";
import styles from "./draggable_embed.css";

export type DraggableEmbedProps = React.HTMLAttributes<HTMLElement> &
  Omit<EmbedDragConfig, "type"> & {
    /**
     * The main title that will be displayed on the draggable embed.
     */
    title: string;
    /**
     * The secondary text that will be displayed below the title on the draggable embed.
     */
    subtitle?: string;
  };

/**
 * @deprecated use `EmbedCard` from `@canva/app-ui-kit` instead.
 */
export const DraggableEmbed: React.FC<DraggableEmbedProps> = ({
  previewUrl,
  embedUrl,
  previewSize,
  title,
  subtitle,
  style,
  ...props
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const opacity = isDragging ? 0 : style?.opacity || 1;
  return (
    <div {...props} style={{ ...style, opacity }} className={styles.draggable}>
      <Rows spacing="1u">
        <img
          draggable={true}
          src={previewUrl}
          onDragStart={async (evt: React.DragEvent<HTMLImageElement>) => {
            setIsDragging(true);
            await ui.startDrag(evt, {
              type: "EMBED",
              previewUrl,
              previewSize,
              embedUrl,
            });
          }}
          onDragEnd={() => setIsDragging(false)}
        />
        <Title size="xsmall">{title}</Title>
        {subtitle && <Text size="small">{subtitle}</Text>}
      </Rows>
    </div>
  );
};
