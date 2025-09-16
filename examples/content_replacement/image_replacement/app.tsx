// For usage information, see the README.md file.
import { useState } from "react";
import { upload } from "@canva/asset";
import { Button, Rows, Text } from "@canva/app-ui-kit";
import { useSelection } from "utils/use_selection_hook";
import * as styles from "styles/components.css";

export const App = () => {
  const [loading, setLoading] = useState(false);
  // Hook to monitor image element selection in the Canva editor
  // Only triggers when image elements are selected by the user
  const selection = useSelection("image");

  const updateImage = async () => {
    setLoading(true);

    // Upload a new image using Canva's asset API
    // This creates a queued image that can be referenced in the design
    const queuedImage = await upload({
      type: "image",
      url: "https://www.canva.dev/example-assets/image-import/image.jpg",
      mimeType: "image/jpeg",
      thumbnailUrl:
        "https://www.canva.dev/example-assets/image-import/thumbnail.jpg",
      aiDisclosure: "none",
    });

    // Read the current selection draft to modify selected image elements
    const draft = await selection.read();
    // Replace each selected image's reference with the new uploaded image
    draft.contents.forEach((s) => (s.ref = queuedImage.ref));
    // Save the changes to update the design with the new image
    await draft.save();

    setLoading(false);
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can replace the selected image.
          Select an image in the editor to begin.
        </Text>
        <Button
          variant="primary"
          onClick={updateImage}
          disabled={selection.count === 0}
          loading={loading}
        >
          Replace with sample image
        </Button>
      </Rows>
    </div>
  );
};
