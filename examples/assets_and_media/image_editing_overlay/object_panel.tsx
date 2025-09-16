import { Alert, Button, Rows, Text, Title } from "@canva/app-ui-kit";
import { appProcess } from "@canva/platform";
import * as React from "react";
import * as styles from "styles/components.css";
import { useOverlay } from "utils/use_overlay_hook";
import { useFeatureSupport } from "utils/use_feature_support";

export const ObjectPanel = () => {
  const overlay = useOverlay("image_selection");
  const isSupported = useFeatureSupport();
  const [isImageReady, setIsImageReady] = React.useState(false);

  React.useEffect(() => {
    // Listen for messages from the overlay about image readiness
    appProcess.registerOnMessage(async (sender, message) => {
      if (
        typeof message === "object" &&
        message != null &&
        "isImageReady" in message
      ) {
        setIsImageReady(Boolean(message.isImageReady));
      }
    });
  }, []);

  const handleOpen = () => {
    overlay.open();
  };

  const handleInvert = () => {
    appProcess.broadcastMessage({ action: "invert" });
  };

  const handleBlur = () => {
    appProcess.broadcastMessage({ action: "blur" });
  };

  const handleReset = () => {
    appProcess.broadcastMessage({ action: "reset" });
  };

  const handleSave = () => {
    overlay.close({ reason: "completed" });
  };

  const handleClose = () => {
    overlay.close({ reason: "aborted" });
  };

  // Check if overlay functionality is supported
  if (!isSupported(overlay.open)) {
    return (
      <div className={styles.scrollContainer}>
        <UnsupportedAlert />
      </div>
    );
  }

  // Show overlay controls when overlay is open
  if (overlay.isOpen) {
    return (
      <div className={styles.scrollContainer}>
        <Rows spacing="3u">
          <Title size="small">Image editing</Title>
          <Text>Apply effects to your image with real-time preview.</Text>
          <Rows spacing="1.5u">
            <Button
              variant="secondary"
              disabled={!isImageReady}
              onClick={handleInvert}
              stretch
            >
              Invert colors
            </Button>
            <Button
              variant="secondary"
              disabled={!isImageReady}
              onClick={handleBlur}
              stretch
            >
              Add blur
            </Button>
            <Button
              variant="secondary"
              disabled={!isImageReady}
              onClick={handleReset}
              stretch
            >
              Reset changes
            </Button>
          </Rows>
          <Rows spacing="1.5u">
            <Button
              variant="primary"
              disabled={!isImageReady}
              onClick={handleSave}
              stretch
            >
              Save and close
            </Button>
            <Button
              variant="secondary"
              disabled={!isImageReady}
              onClick={handleClose}
              stretch
            >
              Close without saving
            </Button>
          </Rows>
        </Rows>
      </div>
    );
  }

  // Show initial state with open overlay button
  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Title size="small">Image editing overlay</Title>
        <Text>
          Select a raster image in your design to start editing with real-time
          preview.
        </Text>
        <Button
          variant="primary"
          disabled={!overlay.canOpen}
          onClick={handleOpen}
          stretch
        >
          Edit image
        </Button>
        {!overlay.canOpen && <SelectionAlert />}
      </Rows>
    </div>
  );
};

// Alert shown when image overlay is not supported
const UnsupportedAlert = () => (
  <Alert tone="warn">
    Image editing overlay functionality is not supported in the current design
    type.
  </Alert>
);

// Alert shown when no valid image is selected
const SelectionAlert = () => (
  <Alert tone="info">
    Select a single raster image in your design to enable image editing. Vector
    images and multiple selections are not supported.
  </Alert>
);
