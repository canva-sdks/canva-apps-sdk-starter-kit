import React from "react";
import { Rows, Text, EmbedCard } from "@canva/app-ui-kit";
import * as styles from "styles/components.css";
import { ui, type EmbedDragConfig } from "@canva/design";
import { useFeatureSupport } from "utils/use_feature_support";
import { useAddElement } from "utils/use_add_element";

export const App = () => {
  const isSupported = useFeatureSupport();
  const addElement = useAddElement();

  const thumbnailUrl =
    "https://www.canva.dev/example-assets/images/puppyhood.jpg";
  const previewSize = { width: 300, height: 200 };
  const embedUrl =
    "https://www.youtube.com/embed/L3MtFGWRXAA?si=duU555FqmToATe2j";

  const onDragStart = (event: React.DragEvent<HTMLElement>) => {
    const dragData: EmbedDragConfig = {
      type: "embed",
      previewUrl: thumbnailUrl,
      previewSize,
      embedUrl,
    };
    if (isSupported(ui.startDragToPoint)) {
      ui.startDragToPoint(event, dragData);
    } else if (isSupported(ui.startDragToCursor)) {
      ui.startDragToCursor(event, dragData);
    }
  };

  const onAddEmbed = () => {
    addElement({
      type: "embed",
      url: embedUrl,
    });
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can support drag-and-drop of embed.
        </Text>
        <EmbedCard
          ariaLabel="Add embed to design"
          thumbnailUrl={thumbnailUrl}
          title="Heartwarming Chatter: Adorable Conversation with a puppy"
          description="Pupppyhood"
          onDragStart={onDragStart}
          onClick={onAddEmbed}
        />
      </Rows>
    </div>
  );
};
