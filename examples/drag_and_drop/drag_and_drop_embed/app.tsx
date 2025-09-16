// For usage information, see the README.md file.
import React from "react";
import { Rows, Text, EmbedCard } from "@canva/app-ui-kit";
import * as styles from "styles/components.css";
import { ui, type EmbedDragConfig } from "@canva/design";
import { useFeatureSupport } from "utils/use_feature_support";
import { useAddElement } from "utils/use_add_element";

export const App = () => {
  const isSupported = useFeatureSupport();
  const addElement = useAddElement();

  // Static content for demo purposes - production apps should load content dynamically
  const thumbnailUrl =
    "https://www.canva.dev/example-assets/images/puppyhood.jpg";
  const previewSize = { width: 300, height: 200 };
  const embedUrl =
    "https://www.youtube.com/embed/L3MtFGWRXAA?si=duU555FqmToATe2j";

  // Handle drag start for embedding content into the design
  const onDragStart = (event: React.DragEvent<HTMLElement>) => {
    // Configure drag data for embed element with preview and URL
    const dragData: EmbedDragConfig = {
      type: "embed",
      previewUrl: thumbnailUrl,
      previewSize,
      embedUrl,
    };
    // Use feature detection to support different drag APIs
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
          This example demonstrates how apps can support drag and drop of embed
          content.
        </Text>
        <EmbedCard
          ariaLabel="Add embed to design"
          thumbnailUrl={thumbnailUrl}
          title="Heartwarming chatter: Adorable conversation with a puppy"
          description="Puppyhood"
          onDragStart={onDragStart}
          onClick={onAddEmbed}
        />
      </Rows>
    </div>
  );
};
