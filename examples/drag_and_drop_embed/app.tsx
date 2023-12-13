import React from "react";
import { Rows, Text, EmbedCard } from "@canva/app-ui-kit";
import styles from "styles/components.css";
import { addNativeElement, ui } from "@canva/design";

export const App = () => {
  const thumbnailUrl =
    "https://www.canva.dev/example-assets/images/puppyhood.jpg";
  const previewSize = { width: 300, height: 200 };
  const embedUrl =
    "https://www.youtube.com/embed/L3MtFGWRXAA?si=duU555FqmToATe2j";

  const onDragStart = (event: React.DragEvent<HTMLElement>) => {
    ui.startDrag(event, {
      type: "EMBED",
      previewUrl: thumbnailUrl,
      previewSize,
      embedUrl,
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
          onClick={() => {
            addNativeElement({
              type: "EMBED",
              url: embedUrl,
            });
          }}
        />
      </Rows>
    </div>
  );
};
