import { useState } from "react";
import { upload } from "@canva/asset";
import { Button, Rows, Text } from "@canva/app-ui-kit";
import { useSelection } from "utils/use_selection_hook";
import * as styles from "styles/components.css";

export const App = () => {
  const [loading, setLoading] = useState(false);
  const selection = useSelection("image");

  const updateImage = async () => {
    setLoading(true);
    // Start uploading the image
    const queuedImage = await upload({
      type: "image",
      url: "https://www.canva.dev/example-assets/image-import/image.jpg",
      mimeType: "image/jpeg",
      thumbnailUrl:
        "https://www.canva.dev/example-assets/image-import/thumbnail.jpg",
      aiDisclosure: "none",
    });

    const draft = await selection.read();
    draft.contents.forEach((s) => (s.ref = queuedImage.ref));
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
