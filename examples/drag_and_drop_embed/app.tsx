import React from "react";
import { Rows, Text, Title } from "@canva/app-ui-kit";
import styles from "styles/components.css";
import { DraggableEmbed } from "components/draggable_embed";

export const App = () => {
  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can support drag-and-drop of embed.
        </Text>
        <DraggableEmbed
          previewUrl="https://www.canva.dev/example-assets/images/puppyhood.jpg"
          previewSize={{ width: 320, height: 180 }}
          embedUrl="https://www.youtube.com/embed/L3MtFGWRXAA?si=duU555FqmToATe2j"
          title="Heartwarming Chatter: Adorable Conversation with a puppy"
          subtitle="Pupppyhood"
        />
      </Rows>
    </div>
  );
};
